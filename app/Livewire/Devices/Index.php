<?php

namespace App\Livewire\Devices;

use App\Classes\Helpers;
use App\Models\Device;
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

        $query = Device::query();

        #filtros
        if (!empty($params['search'])) {
            $query->where(function($q) use ($params) {
                $q->where('name', 'LIKE', '%' . $params['search'] . '%');
                $q->orWhere('uuid', 'LIKE', '%' . $params['search'] . '%');
                $q->orWhere('gate', 'LIKE', '%' . $params['search'] . '%');
            });
        }

        if ($params['active'] !== '') {
            $query->where('active', $params['active']);
        }

        if (!empty($params['zones'])) {
            foreach ($params['zones'] as $zone) {
                $query->where(function($q) use ($zone) {
                    $q->orWhere('zones', 'LIKE', '%"'.$zone.'"%');
                });
            }
        }

        $items = $query->orderBy('id', 'asc')->paginate(5);

        return view('livewire.devices.index', compact('items'));
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
        $model = Device::findOrFail($this->id);
        $model->delete();

        #transfer
        Helpers::transfer([
            'table'  => 'devices',
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
