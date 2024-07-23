<?php

use App\Http\Controllers\HomeController;
use App\Livewire\Menu\Main as MenuMain;
use App\Livewire\Menu\EventoExterno as MenuEventoExterno;
use App\Livewire\Menu\Settings as MenuSettings;
use App\Livewire\Users\Index as Users;
use App\Livewire\Tickets\Index as Tickets;
use App\Livewire\Tickets\Import as TicketsImport;
use App\Livewire\Devices\Index as Devices;
use App\Livewire\Entries\Screen as EntriesScreen;
use App\Livewire\Configurations;
use App\Livewire\Dashboard;
use App\Livewire\Transfers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes(['register' => false]);

Route::middleware(['auth'])->group(function () {
    Route::middleware(['role:admin'])->get('/', MenuMain::class)->name('home');
    Route::get('/evento-externo', MenuEventoExterno::class)->name('menu.evento-externo');
    Route::get('/configuracion-general', MenuSettings::class)->name('menu.configuracion-general');

    Route::get('/users', Users::class)->name('users');
    Route::get('/tickets', Tickets::class)->name('tickets');
    Route::get('/devices', Devices::class)->name('devices');
    Route::get('/import', TicketsImport::class)->name('import');
    Route::middleware(['role:admin'])->get('/configurations', Configurations::class)->name('configurations');
    Route::middleware(['role:admin'])->get('/transfers', Transfers::class)->name('transfers');
    Route::get('/dashboard', Dashboard::class)->name('dashboard');


});

Route::get('/screen', EntriesScreen::class)->name('entries.screen');

Route::get('/test', [HomeController::class, 'index']);
