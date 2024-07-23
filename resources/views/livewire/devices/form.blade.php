<div wire:ignore.self class="modal fade" id="modalForm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalFormLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalFormLabel">{{ $modal['title'] }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form wire:submit.prevent="{{ $modal['action'] }}">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12 mb-3">
                            <label for="form-name" class="form-label">{{ __('Nombre') }}</label>
                            <input wire:model="form.name" type="text" class="form-control @error('form.name') is-invalid @enderror" name="name" id="form-name" placeholder="" maxlength="191">
                            @error('form.name') <span class="text-danger">{{ $message }}</span> @enderror
                        </div>

                        <div class="col-lg-12 mb-3">
                            <label for="form-uuid" class="form-label">{{ __('UUID') }}</label>
                            <input
                                wire:model="form.uuid" type="text"
                                x-mask="****************************************************************************************************"
                                class="form-control @error('form.uuid') is-invalid @enderror"
                                name="uuid" id="form-uuid" placeholder="" maxlength="191"
                                {{ $modal['action'] == 'update' ? 'readonly' : '' }}
                            >
                            @error('form.uuid') <span class="text-danger">{{ $message }}</span> @enderror
                        </div>

                        <div class="col-lg-6 mb-3">
                            <label for="form-gate" class="form-label">{{ __('Puerta') }}</label>
                            <input wire:model="form.gate" type="text" class="form-control @error('form.gate') is-invalid @enderror" name="gate" id="form-gate" placeholder="" maxlength="191">
                            @error('form.gate') <span class="text-danger">{{ $message }}</span> @enderror
                        </div>

                        <div class="col-lg-6 mb-3">
                            <label for="form-active" class="form-label">{{ __('Estatus') }}</label>
                            <select wire:model="form.active" class="form-select @error('form.active') is-invalid @enderror" aria-label="{{ __('Estatus') }}">
                                @foreach (config('const.tickets-status') as $key => $value)
                                    <option value="{{ $key }}">{{ $value }}</option>
                                @endforeach
                            </select>
                            @error('form.active') <span class="text-danger">{{ $message }}</span> @enderror
                        </div>

                        <div class="col-lg-12 mb-3">
                            <table class="table">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-4">{{ __('Zonas') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($zones as $key => $zone)
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input wire:model="form.zones" class="form-check-input" type="checkbox" value="{{ $zone['zone'] }}" id="checkZone{{ $key }}">
                                                    <label class="form-check-label d-block" for="checkZone{{ $key }}">
                                                        {{ $zone['zone'] }}
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
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
        });
    </script>
@endpush
