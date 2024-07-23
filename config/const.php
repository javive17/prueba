<?php

return [

    'users-role' => [
        'admin' => 'Administrador',
        'user'  => 'Usuario',
    ],

    'users-role-color' => [
        'admin' => 'dark',
        'user'  => 'secondary',
    ],

    'tickets-status' => [
        1 => 'Activo',
        0 => 'Inactivo',
    ],

    'tickets-status-color' => [
        1 => 'success',
        0 => 'danger',
    ],

    'devices-status' => [
        1 => 'Activo',
        0 => 'Inactivo',
    ],

    'devices-status-color' => [
        1 => 'success',
        0 => 'danger',
    ],

    'configurations-table' => [
        [
            'name'        => 'name',
            'description' => 'Nombre del evento',
            'value'       => '',
        ],
        [
            'name'        => 'url',
            'description' => 'Url del evento',
            'value'       => 'https://reportes.proyesrd.com',
        ],
        [
            'name'        => 'date-start',
            'description' => 'Fecha de inicio del evento',
            'value'       => '',
        ],
        [
            'name'        => 'date-end',
            'description' => 'Fecha de culminacion del evento',
            'value'       => '',
        ],
        [
            'name'        => 'active',
            'description' => 'Status del evento (0:No iniciado 1:Evento iniciado 2:Finalizado)',
            'value'       => '',
        ],
        [
            'name'        => 'banner',
            'description' => 'Banner del evento',
            'value'       => '',
        ],
        [
            'name'        => 'token',
            'description' => 'Token generado para el evento',
            'value'       => '',
        ],
        [
            'name'        => 'data-sync',
            'description' => 'Transferir data (0:No 1:Si)',
            'value'       => '',
        ],
        [
            'name'        => 'uepa-sync',
            'description' => 'Importar data desde UEPA (0:No 1:Si)',
            'value'       => '',
        ],
        [
            'name'        => 'uepa-api-url',
            'description' => 'URL Api UEPA',
            'value'       => '',
        ],
        [
            'name'        => 'uepa-api-token',
            'description' => 'Token Api UEPA',
            'value'       => '',
        ],
    ],

    'accesses-type' => [
        'in'  => 'Entrada',
        'out' => 'Salida',
    ],

    'accesses-type-color' => [
        'in'  => 'success',
        'out' => 'danger',
    ],

    'accesses-allowed' => [
        1 => 'Permitido',
        0 => 'Denegado',
    ],

    'accesses-allowed-color' => [
        1 => 'success',
        0 => 'danger',
    ],

    'accesses-messages' => [
        'Validación correcta',
        'Evento no iniciado',
        'Dispositivo no encontrado',
        'Dispositivo inactivo',
        'Boleta no válida',
        'Boleta inactiva',
        'Boleta fuera de zona',
        'Intento de reingreso',
        'Boleta ya salió'
    ],

];
