<?php

namespace Tests\Feature\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Feature\Stubs\Models\CategoryStub;
use Tests\Feature\Stubs\Resources\CategoryResourceStub;

class CategoryControllerStub extends BasicCrudController
{
    private $rules = [
        'name' => 'required|max:255',
        'description' => 'nullable',
        'is_active' => 'boolean',
    ];

    protected function model(): string
    {
        return CategoryStub::class;
    }

    protected function rulesStore(): array
    {
        return $this->rules;
    }

    protected function rulesUpdate(): array
    {
        return $this->rules;
    }

    protected function resource(): string
    {
        return CategoryResourceStub::class;
    }

    protected function resourceCollection(): string
    {
        return CategoryResourceStub::class;
    }
}
