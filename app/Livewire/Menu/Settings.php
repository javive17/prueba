<?php

namespace App\Livewire\Menu;

use App\Classes\Helpers;
use App\Models\Configuration;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Component;

class Settings extends Component
{
    use LivewireAlert;

    public function render()
    {
        return view('livewire.menu.settings');
    }

    public function start_event()
    {
        $configuration = Configuration::where('name', 'active')->first();
        $configuration->value = 1;
        $configuration->save();

        Helpers::transfer([
            'table'  => 'configurations',
            'action' => 'update',
            'data'   => [
                'id'          => $configuration->id,
                'name'        => $configuration->name,
                'description' => $configuration->description,
                'value'       => $configuration->value,
            ],
        ]);

        $configuration = Configuration::where('name', 'date-start')->first();
        $configuration->value = now()->format('Y-m-d H:i:s');
        $configuration->save();

        Helpers::transfer([
            'table'  => 'configurations',
            'action' => 'update',
            'data'   => [
                'id'          => $configuration->id,
                'name'        => $configuration->name,
                'description' => $configuration->description,
                'value'       => $configuration->value,
            ],
        ]);

        $this->alert('success', 'El evento ha iniciado correctamente');
    }

    public function end_event()
    {
        $configuration = Configuration::where('name', 'active')->first();
        $configuration->value = 2;
        $configuration->save();

        Helpers::transfer([
            'table'  => 'configurations',
            'action' => 'update',
            'data'   => [
                'id'          => $configuration->id,
                'name'        => $configuration->name,
                'description' => $configuration->description,
                'value'       => $configuration->value,
            ],
        ]);

        $configuration = Configuration::where('name', 'date-end')->first();
        $configuration->value = now()->format('Y-m-d H:i:s');
        $configuration->save();

        Helpers::transfer([
            'table'  => 'configurations',
            'action' => 'update',
            'data'   => [
                'id'          => $configuration->id,
                'name'        => $configuration->name,
                'description' => $configuration->description,
                'value'       => $configuration->value,
            ],
        ]);

        $this->alert('success', 'El evento ha finalizado correctamente');
    }
}
