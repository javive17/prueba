<?php

namespace Database\Seeders;

use App\Classes\Helpers;
use App\Models\Configuration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configurations = config('const.configurations-table');
        foreach ($configurations as $configuration) {
            $model = new Configuration();
            $model->name        = $configuration['name'];
            $model->description = $configuration['description'];
            $model->value       = $configuration['value'];
            $model->save();

            Helpers::transfer([
                'table'  => 'configurations',
                'action' => 'create',
                'data'   => [
                    'id'          => $model['id'],
                    'name'        => $model['name'],
                    'description' => $model['description'],
                    'value'       => $model['value'],
                ],
            ]);
        }
    }
}
