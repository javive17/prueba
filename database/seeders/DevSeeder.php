<?php

namespace Database\Seeders;

use App\Classes\Helpers;
use App\Models\Access;
use App\Models\Device;
use App\Models\Ticket;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DevSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i=1; $i <= 1000; $i++) {
            $ticket = new Ticket();
            $ticket->barcode = $faker->ean13;
            $ticket->name    = $faker->name;
            $ticket->zone    = 'ZONA ' . $faker->randomElement(['A', 'B', 'C', 'D', 'E', 'F']);
            $ticket->active  = $faker->randomElement([0, 1]);
            $ticket->save();

            Helpers::transfer([
                'table'  => 'tickets',
                'action' => 'create',
                'data'   => [
                    'barcode' => $ticket['barcode'],
                    'name'    => $ticket['name'],
                    'zone'    => $ticket['zone'],
                    'active'  => $ticket['active'],
                ],
            ]);
        }

        // for ($i=1; $i <= 10; $i++) {
        //     $z = $faker->randomElement([1, 2, 3, 4, 5, 6]);
        //     $device = new Device();
        //     $device->name      = strtoupper($faker->words(3, true));
        //     $device->uuid      = $faker->uuid;
        //     $device->gate      = strtoupper($faker->words(1, true));
        //     $device->zones     = $faker->randomElements(['ZONA A', 'ZONA B', 'ZONA C', 'ZONA D', 'ZONA E', 'ZONA F'], $z);
        //     $device->active    = $faker->randomElement([0, 1]);
        //     $device->max_count = 100;
        //     $device->count     = $faker->numberBetween(0, 100);
        //     $device->save();

        //     Helpers::transfer([
        //         'table'  => 'devices',
        //         'action' => 'create',
        //         'data'   => [
        //             'name'   => $device['name'],
        //             'uuid'   => $device['uuid'],
        //             'gate'   => $device['gate'],
        //             'zones'  => $device['zones'],
        //             'active' => $device['active'],
        //         ],
        //     ]);
        // }

        $tickets = collect(DB::table('tickets')->where('active', 1)->get()->toArray());
        $devices = collect(DB::table('devices')->where('active', 1)->get()->toArray());
        $messages = config('const.accesses-messages');
        $message_success = $messages[0];
        $message_errores = $messages;
        array_shift($message_errores);
        $message_errores = collect($message_errores);

        for ($i=1; $i <= 500 ; $i++) {
            $ticket = $tickets->random();
            $device = $devices->random();
            $allowed = 0;
            $message = $message_errores->random();

            if (DB::table('accesses')->where('barcode', $ticket->barcode)->doesntExist()) {
                $allowed = 1;
                $message = $message_success;
            }

            $created_at = $faker->dateTimeBetween('-9 hours', 'now');
            $access = new Access();
            $access->barcode    = $ticket->barcode;
            $access->device_id  = $device->id;
            $access->type       = 'in';
            $access->allowed    = $allowed;
            $access->message    = $message;
            $access->created_at = $created_at;
            $access->updated_at = $created_at;
            $access->save();

            Helpers::transfer([
                'table'  => 'accesses',
                'action' => 'create',
                'data'   => [
                    'barcode'   => $access['barcode'],
                    'device_id' => $access['device_id'],
                    'type'      => $access['type'],
                    'allowed'   => $access['allowed'],
                    'message'   => $access['message'],
                ],
            ]);
        }

        $devices = collect(DB::table('devices')->where('active', 1)->get()->toArray());
        foreach ($devices as $device) {
            $device = Device::find($device->id);
            $device->count = $device->accesses->where('type', 'in')->where('allowed', 1)->count();
            $device->save();
        }
    }
}
