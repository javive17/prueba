<div class="kt-overlay d-none" wire:loading.class.remove="d-none" @if (!empty($target)) wire:target="{{ $target }}" @endif>
    <div class="kt-overlay__inner">
        <div class="kt-overlay__content"><span class="kt-spinner"></span></div>
    </div>
</div>
