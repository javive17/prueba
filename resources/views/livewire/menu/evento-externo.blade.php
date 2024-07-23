<div>
    <x-slot name="header">
        {{ __('MENÚ EVENTO EXTERNO') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Menú Evento Externo') }}</li>
            </ol>
        </nav>
    </x-slot>

    <main class="main-menu">
        <div class="container">
            <div class="row justify-content-evenly">
                <div class="col-md-auto col-6">
                    <a href="{{ route('import') }}" class="btn btn-app btn-white">
                        <i class="fa-solid fa-upload"></i>
                        <span>{{ __('Importar boletas en CSV/XLS') }}</span>
                    </a>
                </div>

                <div class="col-md-auto col-6">
                    <a href="{{ route('menu.configuracion-general') }}" class="btn btn-app btn-white">
                        <i class="fa-solid fa-gears"></i>
                        <span>{{ __('Configuración General') }}</span>
                    </a>
                </div>

                <div class="col-md-auto col-6">
                    <a href="{{ route('dashboard') }}" class="btn btn-app btn-white">
                        <i class="fa-solid fa-chart-simple"></i>
                        <span>{{ __('Reportes') }}</span>
                    </a>
                </div>
            </div>
        </div>
    </main>
</div>
