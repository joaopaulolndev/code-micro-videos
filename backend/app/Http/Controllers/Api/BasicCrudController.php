<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BasicCrudController extends Controller
{
    protected $paginationSize = 15;

    abstract protected function model(): string;

    abstract protected function rulesStore(): array;

    abstract protected function rulesUpdate(): array;

    abstract protected function resource(): string;

    abstract protected function resourceCollection(): string;

    public function index()
    {
        $data = ! $this->paginationSize ? $this->model()::all() : $this->model()::paginate($this->paginationSize);

        $resourceCollectionClass = $this->resourceCollection();
        $refClass = new \ReflectionClass($this->resourceCollection());

        return $refClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());

        $model = $this->model()::create($validatedData);
        $model->refresh();

        $resource = $this->resource();

        return new $resource($model);
    }

    public function show($id)
    {
        $model = $this->findOrFail($id);

        $resource = $this->resource();

        return new $resource($model);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rulesUpdate());

        $model = $this->findOrFail($id);
        $model->update($validatedData);

        $resource = $this->resource();

        return new $resource($model);
    }

    public function destroy($id)
    {
        $model = $this->findOrFail($id);
        $model->delete();

        return response()->noContent();
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model())->getRouteKeyName();

        return $this->model()::where($keyName, $id)->firstOrFail();
    }
}
