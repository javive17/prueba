<?php

namespace App\Livewire\Entries;

use App\Classes\Helpers;
use Livewire\Attributes\Layout;
use Livewire\Component;

class Screen extends Component
{
    public $bg = '';

    public function mount()
    {
        $this->bg = Helpers::getConfig('banner');
    }

    #[Layout('components.layouts.entries')]
    public function render()
    {
        return view('livewire.entries.screen');
    }
}
