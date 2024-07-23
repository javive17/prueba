<div>
    <x-slot name="header">
        {{ __('LECTORES') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.configuracion-general') }}">{{ __('Configuración General') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Lectores') }}</li>
            </ol>
        </nav>
    </x-slot>

    <main class="main-menu">
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="card card-crud">
                        <div class="card-header">
                            <div class="row justify-content-between">
                                <div class="col-sm">
                                    <div class="input-group">
                                        <input wire:model="params.search" type="text" class="form-control" placeholder="{{ __('Buscar') }}" aria-label="{{ __('Buscar') }}" aria-describedby="button-search">
                                        <button wire:click="search" class="btn btn-outline-secondary" type="button" id="button-search">
                                            <i class="fa-solid fa-search"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-sm-auto">
                                    <select wire:model="params.active" wire:change="search" class="form-select" aria-label="{{ __('Estatus') }}">
                                        <option value="">{{ __('Estatus') }}</option>
                                        @foreach (config('const.devices-status') as $key => $value)
                                            <option value="{{ $key }}">{{ $value }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-sm-auto">
                                    <div class="dropdown">
                                        <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                                            {{ __('Zonas') }}
                                        </button>
                                        <ul class="dropdown-menu">
                                            @foreach ($zones as $key => $zone)
                                                <li>
                                                    <div class="dropdown-item">
                                                        <div class="form-check">
                                                            <input wire:model="params.zones" wire:change="search" class="form-check-input" type="checkbox" value="{{ $zone['zone'] }}" id="chkParams{{ $key }}">
                                                            <label class="form-check-label" for="chkParams{{ $key }}">
                                                                {{ $zone['zone'] }}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </li>
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>

                                <div class="col-md-auto col-12">
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalForm">
                                        <i class="fa-solid fa-plus"></i>
                                        <span>{{ __('Agregar') }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" style="min-width: 150px;">{{ __('Nombre') }}</th>
                                            <th scope="col" style="min-width: 150px;">{{ __('UUID') }}</th>
                                            <th scope="col" style="min-width: 150px;">{{ __('Puerta') }}</th>
                                            <th scope="col" style="min-width: 250px;">{{ __('Zonas') }}</th>
                                            <th scope="col" style="width: 100px;">{{ __('Estatus') }}</th>
                                            <th scope="col" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @forelse ($items as $item)
                                            <tr>
                                                <th scope="row">{{ $item->name }}</th>
                                                <td>{{ $item->uuid }}</td>
                                                <td>{{ $item->gate }}</td>
                                                <td>
                                                    @foreach ($item->zones as $key => $zone)
                                                        <span class="badge text-bg-secondary">{{ $zone }}</span>
                                                    @endforeach
                                                </td>
                                                <td>
                                                    <span class="badge text-bg-{{ $item->active ? 'success' : 'danger' }}">
                                                        {{ $item->active ? __('Activo') : __('Anulado') }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="btn-group" role="group" aria-label="{{ __('Acciones') }}">
                                                        <button wire:click="$dispatchTo('devices.form', 'edit-modal', { id: {{ $item->id }} })" type="button" class="btn btn-sm btn-outline-dark">
                                                            <i class="fa-solid fa-edit"></i>
                                                        </button>
                                                        <button wire:click="confirm({{ $item->id }})" type="button" class="btn btn-sm btn-outline-danger">
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="6">
                                                    <div class="alert alert-light" role="alert">
                                                        {{ __('No hay registros') }}
                                                    </div>
                                                </td>
                                            </tr>
                                        @endforelse
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between align-items-center flex-column flex-md-row">
                                <span>
                                    {{ $items->total() }} registros
                                </span>

                                {{ $items->links() }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    @livewire('devices.form')
</div>
