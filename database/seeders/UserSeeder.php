<?php

namespace Database\Seeders;

use App\Classes\Helpers;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('proyesrd**');

        //  User admin
        User::factory()->create([
            'name'     => 'Soporte',
            'email'    => 'soporte@proyesrd.com',
            'role'     => 'admin',
            'password' => $password,
        ]);

        $user = User::find(1)->toArray();
        Helpers::transfer([
            'table'  => 'users',
            'action' => 'create',
            'data'   => [
                'id'       => $user['id'],
                'name'     => $user['name'],
                'email'    => $user['email'],
                'role'     => $user['role'],
                'password' => $password,
            ],
        ]);
    }
}
