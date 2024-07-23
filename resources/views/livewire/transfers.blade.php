<div>
    <x-slot name="header">
        {{ __('TAREAS') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.configuracion-general') }}">{{ __('Configuración General') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Tareas') }}</li>
            </ol>
        </nav>
    </x-slot>

    <main
        class="main-menu"
        @if (!empty(HP::getConfig('data-sync')) || !empty(HP::getConfig('uepa-sync')))
            wire:poll.keep-alive
        @endif
    >
        <div class="container">
            <div class="row">
                @if (HP::getConfig('data-sync'))
                    <div class="col-sm-6">
                        <div class="card text-bg-light mb-3">
                            <div class="card-header fw-bold text-center">{{ __('Importar') }}</div>
                            <div class="card-body" style="min-height: 140px;">
                                <h5 class="card-title fs-1 fw-bold text-center">{{ number_format($import_data->count(), 0, ',') }}</h5>
                                <p class="card-text text-center">{{ __('Tareas pendientes por importar') }}</p>
                                @if ($importing)
                                    <div class="progress" role="progressbar" aria-label="{{ __('Porcentaje de importación') }}" aria-valuenow="{{ $imported_percent }}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {{ $imported_percent }}%">
                                            <div class="fs-6 fw-bold text-body text-center"></div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="card text-bg-light mb-3">
                            <div class="card-header fw-bold text-center">{{ __('Exportar') }}</div>
                            <div class="card-body" style="min-height: 140px;">
                                <h5 class="card-title fs-1 fw-bold text-center">{{ number_format($export_data->count(), 0, ',') }}</h5>
                                <p class="card-text text-center">{{ __('Tareas pendientes por exportar') }}</p>
                                @if ($exporting)
                                    <div class="progress" role="progressbar" aria-label="{{ __('Porcentaje de exportación') }}" aria-valuenow="{{ $exported_percent }}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {{ $exported_percent }}%">
                                            <div class="fs-6 fw-bold text-body text-center"></div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="card text-bg-light mb-3">
                            <div class="card-header fw-bold text-center">{{ __('Procesando') }}</div>
                            <div class="card-body" style="min-height: 140px;">
                                <h5 class="card-title fs-1 fw-bold text-center">{{ number_format($process_data->count(), 0, ',') }}</h5>
                                <p class="card-text text-center">{{ __('Tareas pendientes por procesar') }}</p>
                                @if ($processing)
                                    <div class="progress" role="progressbar" aria-label="{{ __('Porcentaje de processación') }}" aria-valuenow="{{ $processed_percent }}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {{ $processed_percent }}%">
                                            <div class="fs-6 fw-bold text-body text-center"></div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endif

                @if (HP::getConfig('uepa-sync'))
                    <div class="col-sm-6">
                        <div class="card text-bg-light mb-3">
                            <div class="card-header fw-bold text-center">{{ __('Importar UEPA') }}</div>
                            <div class="card-body" style="min-height: 140px;">
                                <h5 class="card-title fs-1 fw-bold text-center">{{ number_format($uepa_import_data->count(), 0, ',') }}</h5>
                                <p class="card-text text-center">{{ __('UEPA tickets') }}</p>
                                @if ($uepa_importing)
                                    <div class="progress" role="progressbar" aria-label="{{ __('Porcentaje de importación') }}" aria-valuenow="{{ $uepa_imported_percent }}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {{ $uepa_imported_percent }}%">
                                            <div class="fs-6 fw-bold text-body text-center"></div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endif

                @if (count($process_errors) > 0)
                    <div class="col-sm-12">
                        <div class="card text-bg-light border-danger mb-3">
                            <div class="card-header fw-bold text-center">{{ __('Errores') }}</div>

                            <div class="table-responsive" style="max-height: 400px;">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th style="width: 50px;">#</th>
                                            <th>{{ __('Error') }}</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        @foreach ($process_errors as $error)
                                            <tr>
                                                <td>{{ $loop->iteration }}</td>
                                                <td>{{ $error }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </main>
</div>
