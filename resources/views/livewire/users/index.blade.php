<div>
    <x-slot name="header">
        {{ __('USUARIOS') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item"><a wire:navigate href="{{ route('menu.configuracion-general') }}">{{ __('Configuración General') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Usuarios') }}</li>
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
                                    <select wire:model="params.role" wire:change="search" class="form-select" aria-label="{{ __('Rol') }}">
                                        <option value="">{{ __('Rol') }}</option>
                                        @foreach (config('const.users-role') as $key => $value)
                                            <option value="{{ $key }}">{{ $value }}</option>
                                        @endforeach
                                    </select>
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
                                            <th scope="col" style="width: 100px;">{{ __('ID.') }}</th>
                                            <th scope="col" style="min-width: 200px;">{{ __('Nombre') }}</th>
                                            <th scope="col" style="min-width: 200px;">{{ __('Email') }}</th>
                                            <th scope="col" style="width: 150px;">{{ __('Rol') }}</th>
                                            <th scope="col" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @forelse ($items as $item)
                                            <tr>
                                                <th scope="row">{{ $item->id }}</th>
                                                <td>{{ $item->name }}</td>
                                                <td>{{ $item->email }}</td>
                                                <td>
                                                    <span class="badge text-bg-{{ config('const.users-role-color.' . $item->role) }}">
                                                        {{ config('const.users-role.' . $item->role) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="btn-group" role="group" aria-label="{{ __('Acciones') }}">
                                                        <button wire:click="$dispatchTo('users.form', 'edit-modal', { id: {{ $item->id }} })" type="button" class="btn btn-sm btn-outline-dark">
                                                            <i class="fa-solid fa-edit"></i>
                                                        </button>
                                                        @if ($item->id != 1)
                                                            <button wire:click="confirm({{ $item->id }})" type="button" class="btn btn-sm btn-outline-danger">
                                                                <i class="fa-solid fa-trash"></i>
                                                            </button>
                                                        @endif
                                                    </div>
                                                </td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="5">
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

    @livewire('users.form')
</div>
