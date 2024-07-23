<?php

namespace App\Http\Controllers;

use App\Classes\Helpers;
use App\Models\Access;
use App\Models\Device;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    /**
     * Lectura acceso.
     */
    public function access(Request $request)
    {
        #validar
        $validator = Validator::make($request->all(), [
            'uuid'    => 'required|string',
            'barcode' => 'required|string',
            'type'    => 'required|in:in,out',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Datos incorrectos',
            ], 422);
        }

        $status  = 'success';
        $message = 'Validacion correcta';

        #Device
        $external_device = Device::where('uuid', $request->uuid)->first();

        #Ticket
        $external_ticket = Ticket::where('barcode', $request->barcode)->first();

        #Validar evento
        if (Helpers::getConfig('active') != 1) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'Evento no iniciado',
            ], 422);
        }

        #Validar dispositivo
        if (empty($external_device)) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'Lector no encontrado',
            ], 422);
        }
        elseif ($external_device->active == 0) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'Lector inactivo',
                'data'    => [],
            ], 422);
        }

        #Validar ticket
        elseif (empty($external_ticket)) {
            $status  = 'fail';
            $message = 'Boleta no válida';
        }
        elseif ($external_ticket->active == 0) {
            $status  = 'fail';
            $message = 'Boleta inactiva';
        }
        elseif (!in_array($external_ticket->zone, $external_device->zones)) {
            $status  = 'fail';
            $message = 'Boleta fuera de zona';
        }

        #Ticket
        if ($status == 'success') {
            $external_ticket_access = Access::where('barcode', $external_ticket->barcode)
                ->where('allowed', 1)
                ->orderBy('id', 'desc')
                ->first();

            if (!empty($external_ticket_access)) {
                $datework = Carbon::createFromDate($external_ticket_access->updated_at);
                $now = Carbon::now();
                #obtener la diferencia en segundos para validar si es reingreso (solo en caso de que lo pidan)
                $diff = $datework->diffInSeconds($now);

                if ($external_ticket_access->type == $request->type && $request->type == 'in') {
                    $status  = 'fail';
                    $message = 'Intento de reingreso';
                }
                elseif ($external_ticket_access->type == $request->type && $request->type == 'out') {
                    $status  = 'fail';
                    $message = 'Boleta ya salió';
                }
            }
        }

        #Inserto
        if (!empty($external_ticket)) {
            $external_ticket_access = new Access();
            $external_ticket_access->barcode   = $request->barcode;
            $external_ticket_access->device_id = $external_device->id;
            $external_ticket_access->type      = $request->type;
            $external_ticket_access->allowed   = ($status == 'success' ? 1 : 0);
            $external_ticket_access->message   = $message;
            $external_ticket_access->save();

            #transfer
            Helpers::transfer([
                'table'  => 'accesses',
                'action' => 'create',
                'data'   => [
                    'id'         => $external_ticket_access->id,
                    'barcode'    => $external_ticket_access->barcode,
                    'device_id'  => $external_ticket_access->device_id,
                    'type'       => $external_ticket_access->type,
                    'allowed'    => $external_ticket_access->allowed,
                    'message'    => $external_ticket_access->message,
                    'created_at' => $external_ticket_access->created_at,
                    'updated_at' => $external_ticket_access->updated_at,
                    'uuid'       => $request->uuid,
                ],
            ]);
        }

        #Device
        if ($status == 'success') {
            $ed = Device::find($external_device->id);
            $ed->count = $ed->count + 1;
            $ed->save();

            #transfer
            Helpers::transfer([
                'table'  => 'devices',
                'action' => 'update',
                'data'   => [
                    'id'    => $ed->id,
                    'count' => $ed->count,
                    'uuid'  => $request->uuid,
                ],
            ]);
        }

        #Data
        $data = [];
        if (!empty($external_ticket)) {
            $accesses = Access::select('devices.name', 'devices.gate', 'accesses.created_at', 'accesses.allowed')
                ->leftJoin('tickets', 'tickets.barcode', '=', 'accesses.barcode')
                ->leftJoin('devices', 'devices.id', '=', 'accesses.device_id')
                ->where('accesses.barcode', $external_ticket->barcode)
                ->orderBy('accesses.created_at', 'desc')
                ->get();

            $history = [];
            foreach ($accesses as $item) {
                $history[] = [
                    'name'    => $item->name,
                    'gate'    => $item->gate,
                    'time'    => Carbon::parse($item->created_at)->format('d/m/Y H:i a'),
                    'allowed' => $item->allowed,
                ];
            }

            $data = [
                'barcode' => $external_ticket->barcode,
                'name'    => $external_ticket->name,
                'zone'    => $external_ticket->zone,
                'history' => $history,
            ];
        }

        return response()->json([
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
        ]);
    }

    /**
     * Obtener zonas.
     *
     * @param  string  $uuid
     */
    public function getZones($uuid) {
        $external_device = Device::where('uuid', $uuid)->first();
        if ($external_device) {
            $zones_array = $external_device->zones;
            $zones = [];
            foreach ($zones_array as $zone) {
                $zones[] = [
                    'zone'   => $zone,
                    'active' => true,
                ];
            }
            $external_device->zones = $zones;

            return response()->json([
                'status'  => 'fail',
                'message' => 'Dispositivo ya registrado.',
                'data'    => $external_device,
            ], 422);
        }

        $zones = Ticket::select('zone')
            ->where('active', 1)
            ->groupBy('zone')
            ->orderByRaw('LENGTH(zone)')
            ->orderBy('zone')
            ->get();

        return response()->json([
            'status' => 'OK',
            'data'   => $zones,
        ], 200);
    }

    /**
     * Guardar dispositivo.
     */
    public function storeDevice(Request $request)
    {
        #Validator
        $validator = Validator::make($request->all(), [
            'name'    => 'required',
            'gate'    => 'required',
            'uuid'    => 'required|unique:devices',
            'zones.*' => 'required',
        ], [
            'required' => 'Todos los campos son requeridos.',
            'unique'   => 'UUID se encuentra registrado.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'ERROR',
                'message' => $validator->errors()->all()[0],
                'errores' => $validator->errors()->all(),
            ], 422);
        }

        if (!$request->zones) {
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Todos los campos son requeridos.',
            ], 422);
        }

        #Create
        $external_device = new Device();
        $external_device->name   = $request->name;
        $external_device->uuid   = $request->uuid;
        $external_device->gate   = $request->gate;
        $external_device->zones  = $request->zones;
        $external_device->active = 1;
        $external_device->save();

        #transfer
        Helpers::transfer([
            'table'  => 'devices',
            'action' => 'create',
            'data'   => [
                'id'         => $external_device->id,
                'name'       => $external_device->name,
                'uuid'       => $external_device->uuid,
                'gate'       => $external_device->gate,
                'zones'      => $external_device->zones,
                'active'     => $external_device->active,
                'created_at' => $external_device->created_at,
                'updated_at' => $external_device->updated_at,
            ],
        ]);

        return response()->json([
            'status'  => 'OK',
            'message' => 'Lector registrado de manera exitosa!',
            'data'    => Device::find($external_device->id),
            'action'  => 'store',
        ]);
    }
}
