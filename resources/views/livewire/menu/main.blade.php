<div>
    <x-slot name="header">
        {{ __('MENÚ PRINCIPAL') }}
    </x-slot>

    <x-slot name="breadcrumbs">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item active" aria-current="page">{{ __('Inicio') }}</li>
            </ol>
        </nav>
    </x-slot>

    <main class="main-menu">
        <div class="container">
            <div class="row justify-content-evenly">
                <div class="col-sm-auto col-6">
                    <a href="#" class="btn btn-app btn-white disabled" disabled>
                        <i class="fa-solid fa-ticket"></i>
                        <span>{{ __('EVENTO PROYES') }}</span>
                    </a>
                </div>

                <div class="col-sm-auto col-6">
                    <a href="{{ route('menu.evento-externo') }}" class="btn btn-app btn-white">
                        <i class="fa-solid fa-ticket-simple"></i>
                        <span>{{ __('EVENTO EXTERNO') }}</span>
                    </a>
                </div>
            </div>
        </div>
    </main>
</div>
