<div>
    <x-slot name="header">
        {{ __('REPORTES') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Reportes') }}</li>
            </ol>
        </nav>
    </x-slot>

    @include('partials.overlay', ['target' => 'resetDeviceCount'])

    <main class="main-menu" wire:poll.keep-alive>
        <div class="container">
            @if (HP::getConfig('data-sync'))
                <div class="row my-2">
                    <div class="col">
                        <a href="{{ route('transfers') }}" class="btn btn-secondary" target="blank">Transferencias</a>
                    </div>
                </div>
            @endif

            <div class="row">
                <div class="col">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title m-0">{{ __('Resumen General') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card text-bg-primary mb-3">
                                        <div class="card-body text-center">
                                            <p class="card-text m-0">{{ __('Total de Boletas') }}</p>
                                            <h1 class="card-title m-0 fw-bolder">{{ number_format($card1['total'], 0, ',', '') }}</h1>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="card text-bg-success mb-3">
                                        <div class="card-body text-center">
                                            <p class="card-text m-0">{{ __('Boletas Ingresadas') }}</p>
                                            <h1 class="card-title m-0 fw-bolder">{{ number_format($card1['ingreso'], 0, ',', '') }}</h1>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="card text-bg-danger mb-3">
                                        <div class="card-body text-center">
                                            <p class="card-text m-0">{{ __('Boletas Pendientes') }}</p>
                                            <h1 class="card-title m-0 fw-bolder">{{ number_format($card1['pendiente'], 0, ',', '') }}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title m-0">{{ __('Boletas ingresadas') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="wrapper" style="height: 300px;">
                                        <livewire:livewire-pie-chart
                                            key="{{ $pieChartModel1->reactiveKey() }}"
                                            :pie-chart-model="$pieChartModel1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title m-0">{{ __('Boletas ingresadas por zona') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="wrapper" style="height: 300px;">
                                        <livewire:livewire-column-chart
                                            key="{{ $columnChartModel1->reactiveKey() }}"
                                            :column-chart-model="$columnChartModel1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title m-0">{{ __('Boletas ingresadas por lectores') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="wrapper" style="height: 300px;">
                                        <livewire:livewire-column-chart
                                            key="{{ $columnChartModel2->reactiveKey() }}"
                                            :column-chart-model="$columnChartModel2"
                                        />
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="wrapper" style="height: 300px;">
                                        <livewire:livewire-pie-chart
                                            key="{{ $pieChartModel2->reactiveKey() }}"
                                            :pie-chart-model="$pieChartModel2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title m-0">{{ __('Entradas por tiempo') }}</h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="wrapper" style="overflow-x: auto; overflow-y: hidden; width: 100%;">
                                        <div style="height: 300px; min-width: {{ count($accesses_by_15minute) * 20 }}px;">
                                            <livewire:livewire-line-chart
                                                key="{{ $lineChartModel1->reactiveKey() }}"
                                                :line-chart-model="$lineChartModel1"
                                            />
                                        </div>

                                        {{-- <livewire:livewire-column-chart
                                            key="{{ $columnChartModel1->reactiveKey() }}"
                                            :column-chart-model="$columnChartModel1"
                                        /> --}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title m-0">{{ __('Dispositivos') }}</h4>
                        </div>

                        <table class="table">
                            <thead>
                                <tr>
                                    <th>{{ __('Nombre') }}</th>
                                    <th style="width: 100px;">{{ __('Conteo') }}</th>
                                    <th style="width: 100px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($devices as $device)
                                    <tr
                                        @if ($device->count >= $device->max_count)
                                            class="table-danger"
                                        @endif
                                    >
                                        <td>{{ $device->name }}</td>
                                        <td>{{ $device->count }}</td>
                                        <td>
                                            <button
                                                type="button"
                                                class="btn btn-danger btn-sm"
                                                wire:click="resetDeviceCount({{ $device->id }})"
                                            >
                                                {{ __('Resetear') }}
                                            </button>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {{-- <div class="row">
                <div class="col">
                    <table class="table">
                        @foreach ($dataUepa as $item)
                            <tr>
                                <td>{{ $item['barcode'] }}</td>
                                <td>{{ $item['name'] }}</td>
                                <td>{{ $item['zone'] }}</td>
                                <td>{{ $item['active'] }}</td>
                            </tr>
                        @endforeach
                    </table>
                </div>
            </div> --}}
        </div>
    </main>

    @livewire('devices.form')
</div>
