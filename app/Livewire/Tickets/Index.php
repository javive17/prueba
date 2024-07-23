<?php

namespace App\Livewire\Tickets;

use App\Classes\Helpers;
use App\Models\Ticket;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Attributes\On;
use Livewire\Component;
use Livewire\WithPagination;

class Index extends Component
{
    use LivewireAlert, WithPagination;

    protected $listeners = [
        'destroy'
    ];

    public $params = [
        'search' => '',
        'active' => '',
        'zones'  => [],
    ];

    public $id;

    public $zones;

    public function mount()
    {
        $this->zones = Helpers::getZones();
    }

    public function search()
    {
        $this->resetPage();
    }

    public function render()
    {
        $params = $this->params;

        $query = Ticket::query();

        #filtros
        if (!empty($params['search'])) {
            $query->where(function($q) use ($params) {
                $q->where('barcode', 'LIKE', '%' . $params['search'] . '%');
                $q->orWhere('name', 'LIKE', '%' . $params['search'] . '%');
            });
        }

        if ($params['active'] !== '') {
            $query->where('active', $params['active']);
        }

        if (!empty($params['zones'])) {
            $query->whereIn('zone', $params['zones']);
        }

        $items = $query->orderBy('id', 'asc')->paginate(5);

        return view('livewire.tickets.index', compact('items'));
    }

    /**
     * Confirmar borrado
     */
    public function confirm($id)
    {
        $this->id = $id;

        $this->alert('question', '¿Está seguro de eliminar este registro?', [
            'position'          => 'center',
            'timer'             => '',
            'toast'             => true,
            'showConfirmButton' => true,
            'onConfirmed'       => 'destroy',
            'showCancelButton'  => true,
            'onDismissed'       => '',
            'cancelButtonText'  => 'Cancelar',
            'confirmButtonText' => 'Si, Eliminar',
            'confirmButtonColor' => '#f54242',
        ]);
    }

    public function destroy()
    {
        $model = Ticket::findOrFail($this->id);
        $model->delete();

        #transfer
        Helpers::transfer([
            'table'  => 'tickets',
            'action' => 'delete',
            'data'   => $model->toArray(),
        ]);

        $this->reset('id');

        $this->alert('success', 'Registro eliminado con éxito');
        $this->dispatch('$refresh');
    }

    #[On('refresh-list')]
    public function refreshList()
    {
        $this->dispatch('$refresh');
    }
}
