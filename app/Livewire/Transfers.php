<?php

namespace App\Livewire;

use App\Classes\Helpers;
use App\Models\Access;
use App\Models\Configuration;
use App\Models\Device;
use App\Models\Ticket;
use App\Models\Transfer;
use App\Models\TransferServer;
use App\Models\User;
use GuzzleHttp\Client;
use Livewire\Component;

class Transfers extends Component
{
    public $source = 'server';

    public $import, $import_data, $importing = false, $imported = 0, $imported_percent = 0;
    public $export, $export_data, $exporting = false, $exported = 0, $exported_percent = 0;
    public $process, $process_data, $processing = false, $processed = 0, $processed_percent = 0;
    public $uepa_import, $uepa_import_data, $uepa_importing = false, $uepa_imported = 0, $uepa_imported_percent = 0;
    public $tickets;
    public $process_errors = [];

    public function mount()
    {
        $this->source = (config('app.source') === 'local') ? 'server' : 'local';
        $this->counters();
    }

    public function render()
    {
        $this->sync();
        return view('livewire.transfers');
    }

    public function counters()
    {
        if (config('app.source') === 'server') {
            $this->import  = collect([]);
            $this->export  = collect([]);
            $this->process = Transfer::where('completed', 0)->where('source', 'local')->get();
            $this->import_data = $this->import;
            $this->export_data = $this->export;
            $this->process_data = $this->process;
            if (count($this->import) > 0) $this->importing = true;
            if (count($this->export) > 0) $this->exporting = true;
            if (count($this->process) > 0) $this->processing = true;
            $this->uepa_import = collect([]);
            $this->uepa_import_data = collect([]);
            $this->uepa_importing = false;
        }
        else {
            if (Helpers::getConfig('data-sync')) {
                if (config('app.source') === 'local') {
                    $this->import  = TransferServer::where('completed', 0)->where('source', 'server')->get();
                    $this->export  = Transfer::where('completed', 0)->where('source', 'local')->get();
                    $this->process = Transfer::where('completed', 0)->where('source', 'server')->get();
                }
                else {
                    $this->import  = Transfer::where('completed', 0)->where('source', 'local')->get();
                    $this->export  = Transfer::where('completed', 0)->where('source', 'server')->get();
                    $this->process = Transfer::where('completed', 0)->where('source', 'local')->get();
                }
                $this->import_data = $this->import;
                $this->export_data = $this->export;
                $this->process_data = $this->process;

                if (count($this->import) > 0) $this->importing = true;
                if (count($this->export) > 0) $this->exporting = true;
                if (count($this->process) > 0) $this->processing = true;
            }

            if (Helpers::getConfig('uepa-sync') && config('app.source') === 'local') {
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
                $dataUepa = [];
                foreach ($data as $item) {
                    $dataUepa[] = [
                        'barcode' => trim($item['code']),
                        'name'    => trim($item['productName']),
                        'zone'    => trim($item['zoneName']),
                        'active'  => trim($item['statusId']) ? 0 : 1,
                    ];
                }
                $dataUepa         = collect($dataUepa);
                $dataUepaActive   = $dataUepa->where('active', 1)->count();
                $dataUepaInactive = $dataUepa->where('active', 0)->count();

                $this->tickets   = Ticket::all();
                $ticketsActive   = Ticket::where('active', 1)->count();
                $ticketsInactive = Ticket::where('active', 0)->count();

                if ($dataUepa->count() != $this->tickets->count() || $dataUepaActive != $ticketsActive || $dataUepaInactive != $ticketsInactive) {
                    $this->uepa_import      = $dataUepa;
                    $this->uepa_import_data = $dataUepa;
                    if (count($this->uepa_import) > 0) $this->uepa_importing = true;
                } else {
                    $this->uepa_import      = collect([]);
                    $this->uepa_import_data = collect([]);
                    if (count($this->uepa_import) > 0) $this->uepa_importing = false;
                }
            }
        }
    }

    public function sync()
    {
        $sync = false;

        if (config('app.source') === 'server') {
            if (count($this->import) > 0) $this->imported_percent = intval($this->imported * 100 / count($this->import));
            if (count($this->export) > 0) $this->exported_percent = intval($this->exported * 100 / count($this->export));
            if (count($this->process) > 0) $this->processed_percent = intval($this->processed * 100 / count($this->process));

            if ($this->importing) {
                $sync = true;
                $this->import();
            }

            if (!$this->importing && $this->exporting) {
                $sync = true;
                $this->export();
            }

            if (!$this->importing && !$this->exporting && $this->processing) {
                $sync = true;
                $this->process();
            }
        } else {
            if (Helpers::getConfig('data-sync')) {
                if (count($this->import) > 0) $this->imported_percent = intval($this->imported * 100 / count($this->import));
                if (count($this->export) > 0) $this->exported_percent = intval($this->exported * 100 / count($this->export));
                if (count($this->process) > 0) $this->processed_percent = intval($this->processed * 100 / count($this->process));

                if ($this->importing) {
                    $sync = true;
                    $this->import();
                }

                if (!$this->importing && $this->exporting) {
                    $sync = true;
                    $this->export();
                }

                if (!$this->importing && !$this->exporting && $this->processing) {
                    $sync = true;
                    $this->process();
                }
            }

            if (Helpers::getConfig('uepa-sync')) {
                if (count($this->uepa_import) > 0) $this->uepa_imported_percent = intval($this->uepa_imported * 100 / count($this->uepa_import));

                if (!$this->importing && !$this->exporting && !$this->processing && $this->uepa_importing) {
                    $sync = true;
                    $this->uepa_import();
                }
            }
        }

        if (!$sync) {
            $this->counters();
        }
    }

    public function import()
    {
        if (config('app.source') === 'local') {
            $data = $this->import_data->take(100);
            foreach ($data as $transfer) {
                // insert
                $model = new Transfer();
                $model->table     = $transfer->table;
                $model->action    = $transfer->action;
                $model->data      = $transfer->data;
                $model->source    = $transfer->source;
                $model->completed = $transfer->completed;
                $model->save();

                $transfer->completed = 1;
                $transfer->save();

                $this->imported++;
            }

            if (count($data) > 0) {
                $this->import_data = $this->import_data->skip(100);
            } else {
                $this->importing = false;
            }
        }
    }

    public function export()
    {
        if (config('app.source') === 'local') {
            $data = $this->export_data->take(100);
            foreach ($data as $transfer) {
                // insert
                $model = new TransferServer();
                $model->table     = $transfer->table;
                $model->action    = $transfer->action;
                $model->data      = $transfer->data;
                $model->source    = $transfer->source;
                $model->completed = $transfer->completed;
                $model->save();

                $transfer->completed = 1;
                $transfer->save();

                $this->exported++;
            }

            if (count($data) > 0) {
                $this->export_data = $this->export_data->skip(100);
            } else {
                $this->exporting = false;
            }
        }
    }

    public function process()
    {
        $data = $this->process_data->take(100);
        foreach ($data as $process) {
            $model = null;
            $completed = true;

            try {
                #users
                if ($process->table == 'users') {
                    if ($process->action == 'truncate') {
                        User::truncate();
                    }
                    elseif ($process->action == 'delete') {
                        User::where('email', $process->data['email'])->delete();
                    }
                    elseif ($process->action == 'update') {
                        $model = User::where('email', $process->data['email'])->first();
                    }
                    elseif ($process->action == 'create') {
                        $model = new User();
                        if (isset($process->data['email'])) $model->email = $process->data['email'];
                    }
                    if ($model) {
                        if (isset($process->data['name'])) $model->name = $process->data['name'];
                        if (isset($process->data['role'])) $model->role = $process->data['role'];
                        if (isset($process->data['password'])) $model->password = $process->data['password'];
                        $model->save();
                    }
                }

                #configurations
                elseif ($process->table == 'configurations') {
                    if ($process->action == 'truncate') {
                        Configuration::truncate();
                    }
                    elseif ($process->action == 'delete') {
                        Configuration::where('name', $process->data['name'])->delete();
                    }
                    elseif ($process->action == 'update') {
                        $model = Configuration::where('name', $process->data['name'])->first();
                    }
                    elseif ($process->action == 'create') {
                        $model = new Configuration();
                    }
                    if ($model) {
                        if (isset($process->data['description'])) $model->description = $process->data['description'];
                        if (isset($process->data['value'])) $model->value = $process->data['value'];
                        $model->save();
                    }
                }

                #devices
                elseif ($process->table == 'devices') {
                    if ($process->action == 'truncate') {
                        Device::truncate();
                    }
                    elseif ($process->action == 'delete') {
                        Device::where('uuid', $process->data['uuid'])->delete();
                    }
                    elseif ($process->action == 'update') {
                        $model = Device::where('uuid', $process->data['uuid'])->first();
                    }
                    elseif ($process->action == 'create') {
                        $model = new Device();
                        if (isset($process->data['uuid'])) $model->uuid = $process->data['uuid'];
                    }
                    if ($model) {
                        if (isset($process->data['name'])) $model->name = $process->data['name'];
                        if (isset($process->data['gate'])) $model->gate = $process->data['gate'];
                        if (isset($process->data['zones'])) $model->zones = $process->data['zones'];
                        if (isset($process->data['first_sync'])) $model->first_sync = $process->data['first_sync'];
                        if (isset($process->data['last_sync'])) $model->last_sync = $process->data['last_sync'];
                        if (isset($process->data['active'])) $model->active = $process->data['active'];
                        $model->save();
                    }
                }

                #tickets
                elseif ($process->table == 'tickets') {
                    if ($process->action == 'truncate') {
                        Ticket::truncate();
                    }
                    elseif ($process->action == 'delete') {
                        Ticket::where('barcode', $process->data['barcode'])->delete();
                    }
                    elseif ($process->action == 'update') {
                        $model = Ticket::where('barcode', $process->data['barcode'])->first();
                    }
                    elseif ($process->action == 'create') {
                        $model = new Ticket();
                        if (isset($process->data['barcode'])) $model->barcode = $process->data['barcode'];
                    }
                    if ($model) {
                        if (isset($process->data['zone'])) $model->zone = $process->data['zone'];
                        if (isset($process->data['name'])) $model->name = $process->data['name'];
                        if (isset($process->data['active'])) $model->active = $process->data['active'];
                        $model->save();
                    }
                }

                #accesses
                elseif ($process->table == 'accesses') {
                    if ($process->action == 'truncate') {
                        Access::truncate();
                    }
                    elseif ($process->action == 'create') {
                        $model = new Access();
                        if (isset($process->data['barcode'])) $model->barcode = $process->data['barcode'];
                        if (isset($process->data['device_id'])) $model->device_id = Device::where('uuid', $process->data['uuid'])->first()->id;
                        if (isset($process->data['type'])) $model->type = $process->data['type'];
                        if (isset($process->data['allowed'])) $model->allowed = $process->data['allowed'];
                        if (isset($process->data['message'])) $model->message = $process->data['message'];
                        if (isset($process->data['created_at'])) $model->created_at = $process->data['created_at'];
                        if (isset($process->data['updated_at'])) $model->updated_at = $process->data['updated_at'];
                        $model->save();
                    }
                }
            } catch (\Throwable $th) {
                $this->process_errors[] = $th->getMessage();
                $completed = false;
            }

            if ($completed) {
                $process->completed = 1;
                $process->save();

                $this->processed++;
            }
        }

        if (count($data) > 0) {
            $this->process_data = $this->process_data->skip(100);
        } else {
            $this->processing = false;
        }
    }

    public function uepa_import()
    {
        $data = $this->uepa_import_data->take(100);
        foreach ($data->all() as $transfer) {
            try {
                $found = $this->tickets->where('barcode', $transfer['barcode'])->count();

                if (!$found) {
                    $model = new Ticket();
                    $model->barcode = $transfer['barcode'];
                    $model->zone    = $transfer['zone'];
                    $model->name    = $transfer['name'];
                    $model->active  = $transfer['active'];
                    $model->save();

                    Helpers::transfer([
                        'table'  => 'tickets',
                        'action' => 'create',
                        'data'   => [
                            'id'      => $model->id,
                            'barcode' => $model->barcode,
                            'zone'    => $model->zone,
                            'name'    => $model->name,
                            'active'  => $model->active,
                        ],
                    ]);
                }
                else {
                    $model = Ticket::where('barcode', $transfer['barcode'])->first();
                    $model->barcode = $transfer['barcode'];
                    $model->zone    = $transfer['zone'];
                    $model->name    = $transfer['name'];
                    $model->active  = $transfer['active'];
                    $model->save();

                    Helpers::transfer([
                        'table'  => 'tickets',
                        'action' => 'update',
                        'data'   => [
                            'id'      => $model->id,
                            'barcode' => $model->barcode,
                            'zone'    => $model->zone,
                            'name'    => $model->name,
                            'active'  => $model->active,
                        ],
                    ]);
                }
            } catch (\Throwable $th) {
                $this->process_errors[] = $th->getMessage();
            }

            $this->uepa_imported++;
        }

        if (count($data) > 0) {
            $this->uepa_import_data = $this->uepa_import_data->skip(100);
        } else {
            $this->uepa_importing = false;
        }
    }
}
