<?php

namespace App\Livewire;

use App\Classes\Helpers;
use App\Models\Configuration;
use App\Models\ConfigurationServer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Component;
use Livewire\WithFileUploads;

class Configurations extends Component
{
    use LivewireAlert, WithFileUploads;

    public $form = [];

    public function mount()
    {
        $this->form = Helpers::getConfig();
    }

    public function render()
    {
        return view('livewire.configurations');
    }

    public function update()
    {
        $this->validate([
            'form.name' => 'required',
            'form.url'  => 'required',
        ], [], [
            'form.name' => 'nombre del evento',
            'form.url'  => 'url del evento',
        ]);

        foreach ($this->form as $key => $value) {
            $action = 'update';

            if ($key == 'banner') {
                $value = (is_string($this->form['banner']) ? $this->form['banner'] : $this->form['banner']->store('banners', 'uploads'));
            }
            elseif ($key == 'token') {
                $value = Str::slug($this->form['name'], '-');
                $this->form['token'] = $value;
            }
            elseif ($key == 'active') {
                if ($this->form['active'] === '') $value = 0;
            }

            $configurations = collect(config('const.configurations-table'));

            $configuration = Configuration::where('name', $key)->first();
            if (!$configuration) {
                $configuration = new Configuration();
                $configuration->name        = $key;
                $configuration->description = $configurations->firstWhere('name', $key)['description'];
                $action = 'create';
            }
            $configuration->value = $value;
            $configuration->save();

            Helpers::transfer([
                'table'  => 'configurations',
                'action' => $action,
                'data'   => [
                    'id'          => $configuration->id,
                    'name'        => $configuration->name,
                    'description' => $configuration->description,
                    'value'       => $configuration->value,
                ],
            ]);
        }

        $this->alert('success', 'Configuración actualizada con éxito');
    }

    public function reset_data()
    {
        #Server
        if ($this->form['data-sync'] && config('app.source') == 'local') {
            DB::connection('mysql2')->table('transfers')->delete();
            DB::connection('mysql2')->table('accesses')->delete();
            DB::connection('mysql2')->table('tickets')->delete();
            DB::connection('mysql2')->table('devices')->delete();
            DB::connection('mysql2')->table('configurations')->delete();

            $configurations = config('const.configurations-table');
            foreach ($configurations as $configuration) {
                $model = new ConfigurationServer();
                $model->name        = $configuration['name'];
                $model->description = $configuration['description'];
                $model->value       = $configuration['value'];
                $model->save();
            }
        }

        #Local
        DB::table('transfers')->delete();
        DB::table('accesses')->delete();
        DB::table('tickets')->delete();
        DB::table('devices')->delete();
        DB::table('configurations')->delete();

        $configurations = config('const.configurations-table');
        foreach ($configurations as $configuration) {
            $model = new Configuration();
            $model->name        = $configuration['name'];
            $model->description = $configuration['description'];
            $model->value       = $configuration['value'];
            $model->save();
        }

        $this->form = Helpers::getConfig();

        $this->alert('success', 'Datos reiniciados con éxito');
    }

    public function setUepa()
    {
        $this->form['uepa-api-url'] = '';
        $this->form['uepa-api-token'] = '';
    }
}
