<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\GenreResource;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends BasicCrudController
{
    /**
     * @var array
     */
    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean',
        'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
    ];

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());

        $self = $this;

        /** @var Genre $model */
        $model = \DB::transaction(function () use ($request, $validatedData, $self) {
            $model = $this->model()::create($validatedData);
            $self->handleRelations($model, $request);
            $model->refresh();

            return $model;
        });

        $resource = $this->resource();

        return new $resource($model);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rulesUpdate());

        $self = $this;

        /** @var Genre $model */
        $model = $this->findOrFail($id);
        $model = \DB::transaction(function () use ($request, $validatedData, $self, $model) {
            $model->update($validatedData);
            $self->handleRelations($model, $request);

            return $model;
        });

        $resource = $this->resource();

        return new $resource($model);
    }

    protected function handleRelations(Genre $genre, Request $request)
    {
        $genre->categories()->sync($request->get('categories_id'));
    }

    protected function model(): string
    {
        return Genre::class;
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
        return GenreResource::class;
    }

    protected function resourceCollection(): string
    {
        return GenreResource::class;
    }
}
