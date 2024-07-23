<?php

namespace App\Livewire\Tickets;

use App\Classes\Helpers;
use App\Models\Ticket;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Attributes\On;
use Livewire\Component;

class Form extends Component
{
    use LivewireAlert;

    public $form = [
        'id'      => '',
        'barcode' => '',
        'name'    => '',
        'zone'    => '',
        'active'  => 1,
    ];

    public $modal = [
        'title'  => 'Nuevo ticket',
        'label'  => 'Guardar',
        'action' => 'create',
    ];

    public function render()
    {
        return view('livewire.tickets.form');
    }

    public function create()
    {
        $this->validate([
            'form.barcode' => 'required|unique:tickets,barcode',
            'form.zone'    => 'required',
        ], [], [
            'form.barcode' => 'código',
            'form.zone'    => 'zona',
        ]);

        $model = new Ticket();
        $model->barcode = $this->form['barcode'];
        $model->name    = $this->form['name'];
        $model->zone    = $this->form['zone'];
        $model->active  = $this->form['active'] ?? 0;
        $model->save();

        #transfer
        Helpers::transfer([
            'table'  => 'tickets',
            'action' => 'create',
            'source' => config('app.source'),
            'data'   => [
                'id'      => $model->id,
                'barcode' => $model->barcode,
                'name'    => $model->name,
                'zone'    => $model->zone,
                'active'  => $model->active,
            ],
        ]);

        $this->alert('success', 'Ticket creado con éxito');

        $this->dispatch('modal-hide');

        $this->reset(['form', 'modal']);
    }

    #[On('edit-modal')]
    public function edit($id)
    {
        $model = Ticket::findOrFail($id);

        $this->modal = [
            'title'  => 'Editar ticket',
            'label'  => 'Actualizar',
            'action' => 'update',
        ];

        $this->form = $model->toArray();

        $this->dispatch('modal-show');
    }

    public function update()
    {
        $this->validate([
            'form.zone' => 'required',
        ], [], [
            'form.zone' => 'zona',
        ]);

        $model = Ticket::findOrFail($this->form['id']);
        $model->name   = $this->form['name'];
        $model->zone   = $this->form['zone'];
        $model->active = $this->form['active'] ?? 0;
        $model->save();

        #transfer
        Helpers::transfer([
            'table'  => 'tickets',
            'action' => 'update',
            'data'   => [
                'id'      => $model->id,
                'barcode' => $model->barcode,
                'name'    => $model->name,
                'zone'    => $model->zone,
                'active'  => $model->active,
            ],
        ]);

        $this->alert('success', 'Ticket actualizado con éxito');

        $this->dispatch('modal-hide');

        $this->reset(['form', 'modal']);
    }
}
