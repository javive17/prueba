<div>
    <x-slot name="header">
        {{ __('IMPORTAR TICKETS') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Importar Tickets') }}</li>
            </ol>
        </nav>
    </x-slot>

    <main class="main-menu">
        <div class="container">
            @if ($importing)
                @if ($completed)
                    <div class="row">
                        <div class="col">
                            <div class="alert alert-success" role="alert">
                                <h4 class="alert-heading">{{ __('Importación completada!') }}</h4>
                                <p>{{ __('Se ha completado la importación de los tickets.') }}</p>
                                <hr>
                                <p class="mb-0">
                                    <b>{{ __('Total de registros:') }}</b> {{ $total }} <br>
                                    <b>{{ __('Registros importados:') }}</b> {{ $imported }} <br>
                                    <b>{{ __('Errores encontrados:') }}</b> {{ count($fails) }}
                                </p>
                                <p class="mb-0">
                                    <a href="{{ route('tickets') }}" class="btn btn-primary">
                                        <i class="fa-solid fa-ticket"></i>
                                        <span>{{ __('Ver tickets') }}</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    @if (count($fails))
                        <div class="row">
                            <div class="col">
                                <div class="alert alert-warning" role="alert">
                                    <h4 class="alert-heading">{{ __('Errores encontrados') }}</h4>
                                    <hr>
                                    <table class="table table-warning">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">{{ __('Código') }}</th>
                                                <th scope="col">{{ __('Nombre') }}</th>
                                                <th scope="col">{{ __('Zona') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($fails as $fail)
                                                <tr>
                                                    <td>{{ $fail['index'] }}</td>
                                                    <td>{{ $fail['barcode'] }}</td>
                                                    <td>{{ $fail['name'] }}</td>
                                                    <td>{{ $fail['zone'] }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    @endif
                @else
                    <div class="row">
                        <div class="col">
                            <div wire:poll.keep-alive>
                                {{ __('Importando...') }} {{ $imported }} {{ __('de') }} {{ $total }}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="{{ $percent }}" aria-valuemin="0" aria-valuemax="100">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: {{ $percent }}%"></div>
                            </div>
                        </div>
                    </div>
                @endif
            @else
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="m-0">{{ __('Seleccionar archivo a importar') }}</h5>
                            </div>

                            <div class="card-body">
                                <form wire:submit.prevent="import">
                                    <div class="row">
                                        <div class="col-sm col-12">
                                            <input wire:model="file" class="form-control" type="file" id="file">
                                            @error('file') <span class="text-danger">{{ $message }}</span> @enderror
                                        </div>
                                        <div class="col-sm-auto col-6">
                                            <div class="form-check mt-1">
                                                <input wire:model="hasHeader" class="form-check-input" type="checkbox" value="1" id="hasHeader">
                                                <label class="form-check-label" for="hasHeader">
                                                    {{ __('Tiene cabecera') }}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-sm-auto col-6">
                                            <div class="form-check mt-1">
                                                <input wire:model="deleteAll" class="form-check-input" type="checkbox" value="1" id="deleteAll">
                                                <label class="form-check-label" for="deleteAll">
                                                    {{ __('Eliminar todo') }}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-sm-auto col-12">
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fa-solid fa-upload"></i>
                                                <span>{{ __('Importar') }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </main>

    @livewire('tickets.form')
</div>
