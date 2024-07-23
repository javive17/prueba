@extends('layouts.app')

@section('content')
    <main class="main main-login">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card card-login">
                        <div class="card-body">
                            <form method="POST" action="{{ route('login') }}" class="form-login">
                                @csrf

                                <div class="row mb-4">
                                    <div class="col text-center">
                                        <img src="{{ asset('assets/images/logo-proyes.png') }}" alt="{{ __('Logo') }}" class="img-fluid">
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <h2 class="text-center">{{ __('Iniciar Sesión') }}</h2>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <div class="wrapper-input">
                                            <i class="fa-solid fa-user-large"></i>
                                            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                            @error('email')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <div class="wrapper-input">
                                            <i class="fa-solid fa-lock"></i>
                                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                            @error('password')
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                            <label class="form-check-label" for="remember">
                                                {{ __('Recordarme') }}
                                            </label>
                                        </div>
                                    </div>
                                    @if (Route::has('password.request'))
                                        <div class="col-6">
                                            <a href="{{ route('password.request') }}">
                                                {{ __('Olvidé mi contraseña') }}
                                            </a>
                                        </div>
                                    @endif
                                </div>

                                <div class="row mb-5">
                                    <div class="col">
                                        <button type="submit" class="btn btn-primary mx-auto">
                                            <i class="icon icon-power-off-white"></i>
                                            <span>{{ __('Login') }}</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col">
                                        <div class="copyright text-center">
                                            PROYES | PROYECTOS & ESTRATEGIAS ® 2019 <br>
                                            Website by <a href="https://ktech.com.do" target="_blank" rel="noopener noreferrer">Ktech Solutions</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
@endsection
