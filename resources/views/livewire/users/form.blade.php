<div wire:ignore.self class="modal fade" id="modalForm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalFormLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalFormLabel">{{ $modal['title'] }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form wire:submit.prevent="{{ $modal['action'] }}">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="form-name" class="form-label">{{ __('Nombre') }}</label>
                        <input wire:model="form.name" type="text" class="form-control @error('form.name') is-invalid @enderror" name="name" id="form-name" placeholder="" maxlength="191">
                        @error('form.name') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>

                    <div class="mb-3">
                        <label for="form-email" class="form-label">{{ __('Email') }}</label>
                        <input
                            wire:model="form.email"
                            type="email"
                            class="form-control @error('form.email') is-invalid @enderror"
                            name="email"
                            id="form-email"
                            maxlength="191"
                            @if ($modal['action'] == 'update') disabled @endif
                        >
                        @error('form.email') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>

                    <div class="mb-3">
                        <label for="form-role" class="form-label">{{ __('Rol') }}</label>
                        <select wire:model="form.role" class="form-select @error('form.role') is-invalid @enderror" aria-label="{{ __('Rol') }}">
                            <option value="">Seleccionar</option>
                            @foreach (config('const.users-role') as $key => $value)
                                <option value="{{ $key }}">{{ $value }}</option>
                            @endforeach
                        </select>
                        @error('form.role') <span class="text-danger">{{ $message }}</span> @enderror
                    </div>

                    @if ($modal['action'] == 'update' && !$modal['password_updated'])
                        <div class="mb-3">
                            <button x-on:click="$wire.set('modal.password_updated', true)" type="button" class="btn btn-light">
                                <i class="fa-solid fa-unlock"></i>
                                <span>{{ __('Actualizar contraseña') }}</span>
                            </button>
                        </div>
                    @else
                        <div class="mb-3">
                            <label for="form-password" class="form-label">{{ __('Contraseña') }}</label>
                            <input
                                wire:model="form.password"
                                type="password"
                                class="form-control @error('form.password') is-invalid @enderror"
                                name="password"
                                id="form-password"
                                maxlength="191"
                            >
                            @error('form.password') <span class="text-danger">{{ $message }}</span> @enderror
                        </div>

                        <div class="mb-3">
                            <label for="form-password-confirmation" class="form-label">{{ __('Confirmar') }}</label>
                            <input
                                wire:model="form.password_confirmation"
                                type="password"
                                class="form-control @error('form.password_confirmation') is-invalid @enderror"
                                name="password_confirmation"
                                id="form-password-confirmation"
                                maxlength="191"
                            >
                            @error('form.password_confirmation') <span class="text-danger">{{ $message }}</span> @enderror
                        </div>

                        <div class="py-2 d-flex justify-content-between align-items-center">
                            <span>{{ $modal['password_generated'] ? 'Contraseña: ' : '' }} <b>{{ $modal['password_generated'] }}</b></span>
                            <a wire:click="$dispatch('generate-password')" href="javascript:">{{ __('Generar password') }}</a>
                        </div>
                    @endif
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-save"></i>
                        <span>{{ __('Guardar') }}</span>
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fa-solid fa-times"></i>
                        <span>{{ __('Cerrar') }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        // event dom ready
        document.addEventListener('DOMContentLoaded', function() {
            var modal = new bootstrap.Modal(document.getElementById('modalForm'), {});

            @this.on('modal-show', (event) => {
                modal.show();
            });

            @this.on('modal-hide', (event) => {
                modal.hide();
                @this.dispatch('refresh-list');
            });

            @this.on('generate-password', (event) => {
                var password = Math.random().toString(36).slice(-8);

                @this.set('form.password', password);
                @this.set('form.password_confirmation', password);
                @this.set('modal.password_generated', password);

                navigator.clipboard.writeText(@this.get('form.password'))
                .then(() => {
                    @this.alert('success', 'Contraseña generada y copiada al portapapeles');
                })
                .catch(err => {
                    console.error('Error al copiar al portapapeles:', err)
                });
            });
        });
    </script>
@endpush
