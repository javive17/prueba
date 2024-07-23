<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? config('app.name') }}</title>

        <!-- Scripts -->
        @vite(['resources/sass/app.scss', 'resources/js/app.js'])

        <!-- Styles -->
        <link href="{{ asset('assets/vendor/fontawesome/css/all.min.css') }}" rel="stylesheet">
    </head>
    <body>
        <header class="section-header">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-between">
                    <a href="{{ route('home') }}" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <img src="{{ asset('assets/images/logo-proyes.png') }}" alt="{{ __('Logo') }}" class="img-fluid brand">
                    </a>

                    <div class="dropdown text-end">
                        <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-circle-user"></i>
                            <span>{{ Auth::user()->name }}</span>
                        </a>
                        <ul class="dropdown-menu text-small">
                            <li>
                                <a class="dropdown-item" href="#">
                                    <i class="fa-solid fa-user-pen"></i>
                                    <span>{{ __('Perfil') }}</span>
                                </a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                    <span>{{ __('Logout') }}</span>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>

        @if (!empty($header))
            <section class="section-banner">
                <div class="container">
                    <div class="row justify-content-between">
                        <div class="col-sm-auto col-12 text-center text-sm-left my-1">
                            <h1>{{ $header }}</h1>
                        </div>
                        <div class="col-sm-auto col-12 text-center text-sm-right my-1">
                            <h1></h1>
                        </div>
                    </div>
                </div>
            </section>
        @endif

        @if (!empty($breadcrumbs))
            <section class="section-breadcrumb">
                <div class="container">
                    <div class="row">
                        <div class="col">
                            {{ $breadcrumbs }}
                        </div>
                    </div>
                </div>
            </section>
        @endif

        {{ $slot }}

        <footer class="footer border-top">
            <div class="container">
                <div class="row mb-3">
                    <div class="col text-center">
                        <img src="{{ asset('assets/images/logo-proyes.png') }}" alt="" class="img-fluid footer-brand">
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="copyright">
                            PROYES | PROYECTOS & ESTRATEGIAS ® 2019 <br>
                            Website by <a href="https://ktech.com.do" target="_blank" rel="noopener noreferrer">Ktech Solutions</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        @livewireScripts

        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

        <x-livewire-alert::scripts />
        @livewireChartsScripts

        @stack('scripts')
    </body>
</html>
