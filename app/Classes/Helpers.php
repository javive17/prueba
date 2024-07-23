<?php
namespace App\Classes;

use App\Models\Configuration;
use App\Models\Ticket;
use App\Models\Transfer;

class Helpers
{
    /**
     * Transferir datos
     *
     * @param array $info
     * @return void
     */
    public static function transfer($info)
    {
        $transfer = new Transfer();
        $transfer->table  = $info['table'];
        $transfer->action = $info['action'];
        $transfer->source = ($info['source'] ?? config('app.source'));
        $transfer->data   = ($info['data'] ?? null);
        $transfer->save();
    }

    /**
     * Obtener las zonas
     *
     * @return array
     */
    public static function getZones()
    {
        return Ticket::select('zone')->groupBy('zone')->get()->toArray();
    }

    /**
     * Obtener los valores de la configuración
     *
     * @param string $name
     * @return array
     */
    public static function getConfig($name = null)
    {
        $configurations = Configuration::all();

        $config = [];
        foreach ($configurations as $configuration) {
            $config[$configuration->name] = $configuration->value;
        }

        if ($name) {
            return $config[$name];
        }

        return $config;
    }

    /**
     * Obtener los valores de la configuración
     *
     * @return array
     */
    public static function getConfigDefault()
    {
        $configurations = config('const.configurations-table');

        $config = [];
        foreach ($configurations as $configuration) {
            $config[$configuration['name']] = $configuration['value'];
        }

        return $config;
    }
}
