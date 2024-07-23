<?php

namespace App\Livewire;

use App\Classes\Helpers;
use App\Models\Access;
use App\Models\Device;
use App\Models\Ticket;
use Asantibanez\LivewireCharts\Models\ColumnChartModel;
use Asantibanez\LivewireCharts\Models\LineChartModel;
use Asantibanez\LivewireCharts\Models\PieChartModel;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Livewire\Component;

class Dashboard extends Component
{
    public $devices = [];
    public $device_colors = [];
    public $card1 = [];
    public $dataUepa = [];

    public function mount()
    {
        $this->devices = Device::where('active', 1)->get();
        foreach ($this->devices as $device) {
            $this->device_colors[$device->id] = '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);
        }
    }

    public function render()
    {
        $tickets  = Ticket::get();
        $this->devices = Device::where('active', 1)->get();

        #total de tickets
        $tickets_total = $tickets->count();

        #total de tickets ingresados
        $tickets_ingreso = $tickets->filter(function ($ticket) {
            return $ticket->accesses->where('type', 'in')->where('allowed', 1)->count() > 0;
        })->count();

        #total de tickets pendientes
        $tickets_pendiente = $tickets_total - $tickets_ingreso;

        #total de tickets por zona y orderna la zona en orden alfabetico
        $tickets_by_zones = $tickets->groupBy(function($ticket) {
            return $ticket->zone;
        })->map(function ($tickets, $zone) {
            $total = $tickets->count();
            $allowed = $tickets->filter(function ($ticket) {
                return $ticket->accesses->where('allowed', 1)->where('type', 'in')->count() > 0;
            })->count();
            $pending = $total - $allowed;

            return [
                'zone'    => $zone,
                'total'   => $total,
                'allowed' => $allowed,
                'pending' => $pending,
            ];
        });

        #total de accesos por dispositivo
        $accesses_by_devices = $this->devices->map(function ($device) {
            $accesses = Access::where('device_id', $device->id)
                ->where('type', 'in')
                ->where('allowed', 1)
                ->get();

            if (empty($this->device_colors[$device->id])) {
                $this->device_colors[$device->id] = '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);
            }

            return [
                'device' => $device->name,
                'total'  => $accesses->count(),
                'color' => $this->device_colors[$device->id],
            ];
        });

        #accessos por cada 15 minutos
        $accesses_by_minute = Access::where('type', 'in')
            ->where('allowed', 1)
            ->where('created_at', 'like', '%' . date('Y-m-d') . '%')
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(function ($access) {
                return $access->created_at->format('H:i');
            })
            ->map(function ($accesses, $hour) {
                return [
                    'hour' => $hour,
                    'total' => $accesses->count(),
                ];
            });

        $accesses_by_15minute = [];
        if ($accesses_by_minute->count()) {
            $first_access = $accesses_by_minute->first();
            $hours = [];
            $time = Carbon::createFromFormat('H:i', $first_access['hour']);
            foreach ($accesses_by_minute as $access) {
                while ($time->format('H:i') != $access['hour']) {
                    $hours[] = [
                        'hour' => $time->format('H:i'),
                        'total' => 0,
                    ];
                    $time = $time->addMinutes(1);
                }

                $hours[] = [
                    'hour' => $access['hour'],
                    'total' => $access['total'],
                ];

                $time = $time->addMinutes(1);
            }

            $accesses_by_minute = collect($hours);
            foreach ($accesses_by_minute->chunk(15) as $chunk) {
                if (!count($accesses_by_15minute)) {
                    $hour = Carbon::createFromFormat('H:i', $chunk->first()['hour'])->subMinutes(1)->format('h:i a');
                    $accesses_by_15minute[] = [
                        'hour' => $hour,
                        'total' => 0,
                    ];
                }
                $hour = Carbon::createFromFormat('H:i', $chunk->last()['hour'])->format('h:i a');
                $accesses_by_15minute[] = [
                    'hour' => $hour,
                    'total' => $chunk->sum('total'),
                ];
            }
        }

        //  Resumen General
        $this->card1 = [
            'total'     => $tickets_total,
            'ingreso'   => $tickets_ingreso,
            'pendiente' => $tickets_pendiente,
        ];

        //  Boletas ingresadas (Chart Pie)
        $pieChartModel1 = (new PieChartModel())
            ->setDataLabelsEnabled(true)
            ->addSlice(__('Boletas ingresadas'), $tickets_ingreso, '#198754')
            ->addSlice(__('Boeltas pendientes'), $tickets_pendiente, '#dc3545')
        ;

        //  Boletas ingresadas por zona (Chart Column)
        $columnChartModel1 = (new ColumnChartModel())->multiColumn()->stacked();
        $columnChartModel1->setJsonConfig([
            'plotOptions.bar.dataLabels.total.enabled' => true,
            'plotOptions.bar.horizontal' => false,
            'plotOptions.dataLabels.enabled' => true,
            'plotOptions.dataLabels.style.colors' => ['#fff'],
            'colors' => ['#198754', '#dc3545'],
        ]);
        foreach ($tickets_by_zones as $ticket_by_zone) {
            $columnChartModel1->addSeriesColumn(__('Ingresadas'), $ticket_by_zone['zone'], $ticket_by_zone['allowed'], ['color' => '#198754']);
            $columnChartModel1->addSeriesColumn(__('Pendientes'), $ticket_by_zone['zone'], $ticket_by_zone['pending'], ['color' => '#dc3545']);
        }

        //  Boletas ingresadas por dispositivo (Chart Column)
        $columnChartModel2 = (new ColumnChartModel());
        $columnChartModel2->setJsonConfig([
            'xaxis.labels.show' => false,
        ]);
        foreach ($accesses_by_devices as $access_by_device) {
            $columnChartModel2->addColumn($access_by_device['device'], $access_by_device['total'], $access_by_device['color']);
        }

        $pieChartModel2 = (new PieChartModel())->setDataLabelsEnabled(true);
        foreach ($accesses_by_devices as $access_by_device) {
            $pieChartModel2->addSlice($access_by_device['device'], $access_by_device['total'], $access_by_device['color']);
        }

        $lineChartModel1 = (new LineChartModel());
        foreach ($accesses_by_15minute as $access_by_15minute) {
            $lineChartModel1->addPoint($access_by_15minute['hour'], $access_by_15minute['total']);
        }

        ##
        $url = Helpers::getConfig('uepa-api-url');
        $token = 'Bearer ' . Helpers::getConfig('uepa-api-token');

        $client = new Client();

        $response = $client->request('GET', $url, [
            'headers' => [
                'Authorization' => $token,
            ],
        ]);

        $statusCode = $response->getStatusCode();
        $body = $response->getBody()->getContents();

        $data = json_decode($body, true);
        $this->dataUepa = [];
        $collect = collect($data)->skip(14000);
        foreach ($collect->take(1000) as $item) {
            $this->dataUepa[] = [
                'barcode' => trim($item['code']),
                'name'    => trim($item['productName']),
                'zone'    => trim($item['zoneName']),
                'active'  => trim($item['statusId']) ? 0 : 1,
            ];
        }
        ##

        return view('livewire.dashboard', [
            'pieChartModel1'    => $pieChartModel1,
            'columnChartModel1' => $columnChartModel1,
            'columnChartModel2' => $columnChartModel2,
            'pieChartModel2'    => $pieChartModel2,
            'lineChartModel1'   => $lineChartModel1,

            'accesses_by_15minute'   => $accesses_by_15minute,
        ]);
    }

    public function resetDeviceCount($id)
    {
        $device = Device::find($id);
        $device->count = 0;
        $device->save();
    }
}
