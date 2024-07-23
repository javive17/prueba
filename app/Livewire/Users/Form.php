<?php

namespace App\Livewire\Users;

use App\Classes\Helpers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Attributes\On;
use Livewire\Component;

class Form extends Component
{
    use LivewireAlert;

    public $form = [
        'id'       => '',
        'name'     => '',
        'email'    => '',
        'role'     => '',
        'password' => '',
        'password_confirmation' => '',
    ];

    public $modal = [
        'title'  => 'Nuevo usuario',
        'label'  => 'Guardar',
        'action' => 'create',
        'password_generated' => '',
        'password_updated'   => false,
    ];

    public function render()
    {
        return view('livewire.users.form');
    }

    public function create()
    {
        $this->validate([
            'form.name'     => 'required',
            'form.email'    => 'required|email|unique:users,email',
            'form.role'     => 'required',
            'form.password' => 'required|confirmed',
        ], [], [
            'form.name'     => 'nombre',
            'form.email'    => 'email',
            'form.role'     => 'rol',
            'form.password' => 'contraseña',
        ]);

        $password = Hash::make($this->form['password']);

        $model = new User();
        $model->name     = $this->form['name'];
        $model->email    = $this->form['email'];
        $model->role     = $this->form['role'];
        $model->password = $password;
        $model->save();

        #transfer
        Helpers::transfer([
            'table'  => 'users',
            'action' => 'create',
            'data'   => [
                'id'       => $model->id,
                'name'     => $model->name,
                'email'    => $model->email,
                'role'     => $model->role,
                'password' => $password,
            ],
        ]);

        $this->alert('success', 'Usuario creado con éxito');

        $this->dispatch('modal-hide');

        $this->reset(['form', 'modal']);
    }

    #[On('edit-modal')]
    public function edit($id)
    {
        $model = User::findOrFail($id);

        $this->modal = [
            'title'  => 'Editar usuario',
            'label'  => 'Actualizar',
            'action' => 'update',
            'password_generated' => '',
            'password_updated'   => false,
        ];

        $this->form = $model->toArray();

        $this->dispatch('modal-show');
    }

    public function update()
    {
        $this->validate([
            'form.name'     => 'required',
            'form.role'     => 'required',
            'form.password' => ($this->modal['password_updated'] ? 'required|confirmed' : ''),
        ], [], [
            'form.name'     => 'nombre',
            'form.role'     => 'rol',
            'form.password' => 'contraseña',
        ]);

        $model = User::findOrFail($this->form['id']);
        $model->name     = $this->form['name'];
        $model->email    = $this->form['email'];
        $model->role     = $this->form['role'];
        if ($this->modal['password_updated']) {
            $password = Hash::make($this->form['password']);
            $model->password = $password;
        }
        $model->save();

        #transfer
        $data = [
            'id'    => $model->id,
            'name'  => $model->name,
            'email' => $model->email,
            'role'  => $model->role,
        ];
        if ($this->modal['password_updated']) {
            $data['password'] = $password;
        }
        Helpers::transfer([
            'table'  => 'users',
            'action' => 'update',
            'data'   => $data,
        ]);

        $this->alert('success', 'Usuario actualizado con éxito');

        $this->dispatch('modal-hide');

        $this->reset(['form', 'modal']);
    }
}
