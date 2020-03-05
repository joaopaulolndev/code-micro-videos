<?php

namespace Tests\Feature\Traits;

use Illuminate\Database\Eloquent\Model;

trait TestDeletes
{
    abstract protected function routeDestroy(Model $model): string;

    protected function assertDestroy()
    {
        // reset database
        $this->runDatabaseMigrations();

        $collection = factory($this->model(), 3)->create();
        $model = $collection->first();

        $response = $this->deleteJson($this->routeDestroy($model));

        $response->assertStatus(204);
        $this->assertModelInDatabase($model);

        $response = $this->deleteJson($this->routeDestroy($model));

        $response->assertStatus(404);
        $this->assertModelInDatabase($model);
    }

    private function assertModelInDatabase(Model $model)
    {
        $this->assertCount(2, $this->model()::all());
        $this->assertNull($this->model()::find($model->id));
        $this->assertNotNull($this->model()::withTrashed()->find($model->id));
    }
}
