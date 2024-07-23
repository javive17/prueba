<?php

namespace App\Livewire\Devices;

use App\Classes\Helpers;
use App\Models\Device;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Attributes\On;
use Livewire\Component;

class Form extends Component
{
    use LivewireAlert;

    public $form = [
        'id'     => '',
        'name'   => '',
        'uuid'   => '',
        'gate'   => '',
        'zones'  => [],
        'active' => 1,
    ];

    public $modal = [
        'title'  => 'Nuevo lector',
        'label'  => 'Guardar',
        'action' => 'create',
    ];

    public $zones = [];

    public function mount()
    {
        $this->zones = Helpers::getZones();
    }

    public function render()
    {
        return view('livewire.devices.form');
    }

    public function create()
    {
        $this->validate([
            'form.uuid' => 'required|unique:devices,uuid',
            'form.name' => 'required',
            'form.gate' => 'required',
        ], [], [
            'form.uuid' => 'UUID',
            'form.name' => 'nombre',
            'form.gate' => 'puerta',
        ]);

        $model = new Device();
        $model->name   = $this->form['name'];
        $model->uuid   = $this->form['uuid'];
        $model->gate   = $this->form['gate'];
        $model->zones  = $this->form['zones'];
        $model->active = $this->form['active'] ?? 0;
        $model->save();

        #transfer
        Helpers::transfer([
            'table'  => 'devices',
            'action' => 'create',
            'data'   => [
                'id'     => $model->id,
                'name'   => $model->name,
                'uuid'   => $model->uuid,
                'gate'   => $model->gate,
                'zones'  => $model->zones,
                'active' => $model->active,
            ],
        ]);

        $this->alert('success', 'Device creado con éxito');

        $this->dispatch('modal-hide');

        $this->reset(['form', 'modal']);
    }

    #[On('edit-modal')]
    public function edit($id)
    {
        $model = Device::findOrFail($id);

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
            'form.name' => 'required',
            'form.gate' => 'required',
        ], [], [
            'form.name' => 'nombre',
            'form.gate' => 'puerta',
        ]);

        $model = Device::findOrFail($this->form['id']);
        $model->name   = $this->form['name'];
        $model->gate   = $this->form['gate'];
        $model->zones  = $this->form['zones'];
        $model->active = $this->form['active'] ?? 0;
        $model->save();

        #transfer
        Helpers::transfer([
            'table'  => 'devices',
            'action' => 'update',
            'data'   => [
                'id'     => $model->id,
                'name'   => $model->name,
                'uuid'   => $model->uuid,
                'gate'   => $model->gate,
                'zones'  => $model->zones,
                'active' => $model->active,
            ],
        ]);

        $this->alert('success', 'Device actualizado con éxito');

        $this->dispatch('modal-hide');

        $this->reset(['form', 'modal']);
    }
}
