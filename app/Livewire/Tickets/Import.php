<?php

namespace App\Livewire\Tickets;

use App\Classes\Helpers;
use App\Imports\TicketImport;
use App\Models\Ticket;
use Livewire\Component;
use Livewire\WithFileUploads;
use Maatwebsite\Excel\Facades\Excel;

class Import extends Component
{
    use WithFileUploads;

    public $file;
    public $hasHeader = 0;
    public $deleteAll = 0;

    public $importing = false;
    public $completed = false;
    public $tickets   = [];
    public $fails     = [];
    public $total     = 0;
    public $imported  = 0;
    public $percent   = 0;
    public $index     = 1;

    public function render()
    {
        if ($this->importing) {
            $this->importing();
        }

        return view('livewire.tickets.import');
    }

    public function import()
    {
        $this->validate([
            'file' => 'file|mimes:csv,xls,xlsx|max:4096', // 4MB Max
        ], [], [
            'file' => 'archivo',
        ]);

        $array = Excel::toArray(new TicketImport, $this->file);
        $this->tickets = $array[0];
        $this->importing = true;
        $this->total = count($this->tickets);
    }

    public function importing()
    {
        if ($this->importing) {
            $first = 0;
            if ($this->hasHeader && $this->index == 1) {
                $first = 1;
                ++$this->index;
            }
            $data = array_slice($this->tickets, $first, 100);
            foreach ($data as $item) {
                $action = "update";
                $ticket = Ticket::where('barcode', $item[0])->first();

                if (empty($item[0]) || empty($item[2])) {
                    $this->fails[] = [
                        'barcode' => $item[0],
                        'name'    => $item[1],
                        'zone'    => $item[2],
                        'index'   => $this->index,
                    ];

                    ++$this->index;
                    continue;
                }

                if (empty($ticket)) {
                    $ticket = new Ticket();
                    $action = "create";
                }
                $ticket->barcode = $item[0];
                $ticket->name    = $item[1];
                $ticket->zone    = $item[2];
                $ticket->active  = 1;
                $ticket->save();

                #transfer
                Helpers::transfer([
                    'table'  => 'tickets',
                    'action' => $action,
                    'data'   => [
                        'id'     => $ticket->id,
                        'name'   => $ticket->name,
                        'zone'   => $ticket->zone,
                        'active' => $ticket->active,
                    ],
                ]);

                ++$this->imported;
                ++$this->index;
                $this->percent = round(($this->index * 100) / $this->total);
            }

            $new = array_slice($this->tickets, 100);
            $this->tickets = $new;

            if (count($this->tickets) == 0) {
                $this->completed = true;
            }
        }
    }
}
