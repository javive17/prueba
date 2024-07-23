<div>
    <x-slot name="header">
        {{ __('CONFIGURACIÓN DEL EVENTO') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.configuracion-general') }}">{{ __('Configuración General') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Configuración del Evento') }}</li>
            </ol>
        </nav>
    </x-slot>

    @include('partials.overlay', ['target' => 'update, reset_data'])

    <main class="main-menu">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xxl-6 col-xl-7 col-lg-8 col-md-9">
                    <div class="card">
                        <div class="card-body">
                            <form wire:submit.prevent="update">
                                @if ($form['active'] != '1')
                                    <div class="row mb-4">
                                        <div class="col">
                                            <button wire:click="reset_data" type="button" class="btn btn-danger btn-lg w-100">{{ __('Resetear Todo') }}</button>
                                        </div>
                                    </div>
                                @endif

                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label for="form-name" class="form-label">{{ __('Nombre del evento') }}</label>
                                        <input wire:model="form.name" type="text" class="form-control @error('form.name') is-invalid @enderror" name="name" id="form-name" placeholder="" maxlength="191" {{ $form['active'] === '2' ? 'disabled' : '' }}>
                                        @error('form.name') <span class="text-danger">{{ $message }}</span> @enderror
                                    </div>

                                    <div class="col-md-4 mb-3">
                                        @if ($form['active'] === '')
                                            <span class="badge text-bg-danger">{{ __('Evento no iniciado') }}</span>
                                        @elseif ($form['active'] === '1')
                                            <span class="badge text-bg-success">{{ __('Evento iniciado') }}</span>
                                        @else
                                            <span class="badge text-bg-danger">{{ __('Evento finalizado') }}</span>
                                        @endif
                                    </div>

                                    <div class="col-md-4 mb-3">
                                        <div class="form-check">
                                            <input wire:model="form.data-sync" class="form-check-input" value="1" type="checkbox" id="form-data-sync" {{ $form['active'] === '2' ? 'disabled' : '' }} {{ $form['data-sync'] === '1' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="form-data-sync">
                                                {{ __('Transferir data') }}
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-md-4 mb-3">
                                        <div class="form-check">
                                            <input wire:model="form.uepa-sync" wire:click="setUepa" class="form-check-input" value="1" type="checkbox" id="form-uepa-sync" {{ $form['active'] === '2' ? 'disabled' : '' }} {{ $form['uepa-sync'] === '1' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="form-uepa-sync">
                                                {{ __('Importar desde UEPA') }}
                                            </label>
                                        </div>
                                    </div>

                                    @if ($form['uepa-sync'])
                                        <div class="col-md-12 mb-3">
                                            <label for="form-uepa-api-url" class="form-label">{{ __('URL Api UEPA') }}</label>
                                            <input wire:model="form.uepa-api-url" type="text" class="form-control @error('form.uepa-api-url') is-invalid @enderror" name="uepa-api-url" id="form-uepa-api-url" placeholder="" maxlength="191" {{ $form['active'] === '2' ? 'disabled' : '' }}>
                                            @error('form.uepa-api-url') <span class="text-danger">{{ $message }}</span> @enderror
                                        </div>

                                        <div class="col-md-12 mb-3">
                                            <label for="form-uepa-api-token" class="form-label">{{ __('URL Token UEPA') }}</label>
                                            <input wire:model="form.uepa-api-token" type="text" class="form-control @error('form.uepa-api-token') is-invalid @enderror" name="uepa-api-token" id="form-uepa-api-token" placeholder="" maxlength="191" {{ $form['active'] === '2' ? 'disabled' : '' }}>
                                            @error('form.uepa-api-token') <span class="text-danger">{{ $message }}</span> @enderror
                                        </div>
                                    @endif

                                    <div class="col-md-12 mb-3">
                                        <label for="form-url" class="form-label">{{ __('URL del evento') }}</label>
                                        <input wire:model="form.url" type="text" class="form-control @error('form.url') is-invalid @enderror" name="url" id="form-url" placeholder="" maxlength="191" {{ $form['active'] === '2' ? 'disabled' : '' }}>
                                        @error('form.url') <span class="text-danger">{{ $message }}</span> @enderror
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="form-date-start" class="form-label">{{ __('Fecha de inicio') }}</label>
                                        <input wire:model="form.date-start" type="text" class="form-control @error('form.date-start') is-invalid @enderror" name="date-start" id="form-date-start" placeholder="" disabled>
                                        @error('form.date-start') <span class="text-danger">{{ $message }}</span> @enderror
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="form-date-end" class="form-label">{{ __('Fecha de culminación') }}</label>
                                        <input wire:model="form.date-end" type="text" class="form-control @error('form.date-end') is-invalid @enderror" name="date-end" id="form-date-end" placeholder="" disabled>
                                        @error('form.date-end') <span class="text-danger">{{ $message }}</span> @enderror
                                    </div>

                                    <div class="col-md-12 mb-0">
                                        <label for="form-banner" class="form-label">{{ __('Seleccionar banner') }}</label>
                                        <input wire:model="form.banner" class="form-control" type="file" name="banner" id="form-banner" aria-describedby="bannerHelpBlock" {{ $form['active'] === '2' ? 'disabled' : '' }}>
                                        <div id="bannerHelpBlock" class="form-text">
                                            {{ __('Dimensiones recomendadas 1920x1050 en formatos: jpeg, png, jpg, svg o webp.') }}
                                        </div>
                                        @error('form.banner') <span class="text-danger">{{ $message }}</span> @enderror
                                    </div>

                                    <div class="col-md-12 mb-3">
                                        @if ($form['banner'])
                                            @if (is_string($form['banner']))
                                                <img src="{{ asset('uploads/'.$form['banner']) }}" class="img-fluid" alt="{{ __('Banner') }}" title="{{ __('Banner') }}" class="img-fluid" />
                                            @else
                                                <img src="{{ $form['banner']->temporaryUrl() }}" class="img-fluid" alt="{{ $form['banner']->getClientOriginalName() }}" title="{{ $form['banner']->getClientOriginalName() }}" class="img-fluid" />
                                            @endif
                                        @endif
                                    </div>

                                    <div class="col-md-12 mb-3">
                                        <label for="form-entries" class="form-label">{{ __('URL dashboard de entradas') }}</label>
                                        @if (!empty($form['token']))
                                            <p><a href="{{ config('app.url') . '/lecturas/' . $form['token'] }}" target="_blank">{{ config('app.url') . '/lecturas/' . $form['token'] }}</a></p>
                                        @endif
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col text-center">
                                        @if ($form['active'] !== '2')
                                            <button type="submit" class="btn btn-primary" style="width: 125px;">
                                                <i class="fa-solid fa-save"></i>
                                                <span>{{ __('Guardar') }}</span>
                                            </button>
                                        @endif

                                        <a href="{{ route('menu.configuracion-general') }}" class="btn btn-secondary" style="width: 125px;">
                                            <i class="fa-solid fa-times"></i>
                                            <span>{{ __('Cerrar') }}</span>
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    @livewire('devices.form')
</div>
