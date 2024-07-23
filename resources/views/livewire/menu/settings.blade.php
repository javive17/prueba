<div>
    <x-slot name="header">
        {{ __('MENÚ CONFIGURACIÓN') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('home') }}">{{ __('Inicio') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('menu.evento-externo') }}">{{ __('Menú Evento Externo') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page">{{ __('Configuración General') }}</li>
            </ol>
        </nav>
    </x-slot>

    @include('partials.overlay', ['target' => 'start_event, end_event'])

    <main class="main-menu">
        <div class="container">
            <div class="row justify-content-evenly">
                <div class="col-md-auto col-6">
                    <a href="{{ route('users') }}" class="btn btn-app btn-white">
                        <i class="fa-regular fa-user"></i>
                        <span>{{ __('Usuarios') }}</span>
                    </a>
                </div>

                <div class="col-md-auto col-6">
                    <a href="{{ route('devices') }}" class="btn btn-app btn-white">
                        <i class="fa-solid fa-laptop-code"></i>
                        <span>{{ __('Lectores') }}</span>
                    </a>
                </div>

                <div class="col-md-auto col-6">
                    <a href="{{ route('tickets') }}" class="btn btn-app btn-white">
                        <i class="fa-solid fa-ticket"></i>
                        <span>{{ __('Tickets') }}</span>
                    </a>
                </div>

                @if (Auth::user()->role === 'admin')
                    <div class="col-md-auto col-6">
                        <a href="{{ route('configurations') }}" class="btn btn-app btn-white">
                            <i class="fa-solid fa-ticket-simple"></i>
                            <span>{{ __('Configurar Evento') }}</span>
                        </a>
                    </div>

                    @if (HP::getConfig('active') === '0')
                        <div class="col-md-auto col-6">
                            <a wire:click="start_event" href="javascript:" class="btn btn-app btn-green">
                                <i class="fa-solid fa-power-off"></i>
                                <span>{{ __('Iniciar Evento') }}</span>
                            </a>
                        </div>
                    @elseif (HP::getConfig('active') === '1')
                        <div class="col-md-auto col-6">
                            <a wire:click="end_event" href="javascript:" class="btn btn-app btn-red">
                                <i class="fa-solid fa-power-off"></i>
                                <span>{{ __('Finalizar Evento') }}</span>
                            </a>
                        </div>
                    @endif
                @endif
            </div>
        </div>
    </main>
</div>
