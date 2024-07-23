<?php

namespace App\Livewire\Users;

use App\Classes\Helpers;
use App\Models\User;
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
        'role'   => '',
    ];

    public $id;

    public function search()
    {
        $this->resetPage();
    }

    public function render()
    {
        $params = $this->params;

        $query = User::query();

        #filtros
        if (!empty($params['search'])) {
            $query->where(function($q) use ($params) {
                $q->where('name', 'LIKE', '%' . $params['search'] . '%');
                $q->orWhere('email', 'LIKE', '%' . $params['search'] . '%');
            });
        }

        if (!empty($params['role'])) {
            $query->where('role', $params['role']);
        }

        $items = $query->orderBy('id', 'asc')->paginate(5);

        return view('livewire.users.index', compact('items'));
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
        $model = User::findOrFail($this->id);
        $model->delete();

        #transfer
        Helpers::transfer([
            'table'  => 'users',
            'action' => 'delete',
            'source' => config('app.source'),
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
