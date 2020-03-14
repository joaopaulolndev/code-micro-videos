<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\GenreController;
use App\Http\Resources\GenreResource;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Tests\Exceptions\TestException;
use Tests\Feature\Traits\TestDeletes;
use Tests\Feature\Traits\TestSaves;
use Tests\Feature\Traits\TestValidations;
use Tests\TestCase;
use Tests\Traits\TestResources;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestDeletes, TestResources;

    /**
     * @var Genre
     */
    private $genre;

    private $fieldsSerialized = [
        'id',
        'name',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at',
        'categories' => [
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ],
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->genre = factory(Genre::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJsonFragment($this->genre->toArray())
            ->assertJsonStructure([
                'data' => [
                    '*' => $this->fieldsSerialized,
                ],
                'links' => [],
                'meta' => [],
            ]);

        $this->assertResource($response, GenreResource::collection(collect([$this->genre])));
    }

    public function testShow()
    {
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));

        $response
            ->assertStatus(200)
            ->assertJsonFragment($this->genre->toArray())
            ->assertJsonStructure(['data' => $this->fieldsSerialized]);

        $this->assertResource($response, new GenreResource($this->genre));
    }

    public function testInvalidationData()
    {
        $data = ['name' => '', 'categories_id' => ''];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = ['is_active' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');

        $data = ['categories_id' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['categories_id' => [100]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create();
        $category->delete();

        $data = ['categories_id' => [$category->id]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testStore()
    {
        $categoryId = factory(Category::class)->create()->id;

        $data = ['name' => 'test_name'];
        $response = $this->assertStore(
            $data + ['categories_id' => [$categoryId]],
            $data + ['is_active' => true, 'deleted_at' => null]
        );
        $response->assertJsonStructure(['data' => $this->fieldsSerialized]);
        $this->assertResource($response, new GenreResource(Genre::find($response->json('data.id'))));
        $this->assertHasCategory($response->json('data.id'), $categoryId);

        $data = ['name' => 'test_name', 'is_active' => false];
        $response = $this->assertStore($data + ['categories_id' => [$categoryId]], $data);
        $response->assertJsonStructure(['data' => $this->fieldsSerialized]);
        $this->assertResource($response, new GenreResource(Genre::find($response->json('data.id'))));
        $this->assertHasCategory($response->json('data.id'), $categoryId);
    }

    public function testUpdate()
    {
        $categoryId = factory(Category::class)->create()->id;

        $this->genre = factory(Genre::class)->create([
            'name' => 'test_name',
            'is_active' => false,
        ]);

        $data = ['name' => 'test_name_updated', 'is_active' => true];
        $response = $this->assertUpdate($data + ['categories_id' => [$categoryId]], $data + ['deleted_at' => null]);
        $response->assertJsonStructure(['data' => $this->fieldsSerialized]);
        $this->assertResource($response, new GenreResource(Genre::find($response->json('data.id'))));
        $this->assertHasCategory($response->json('data.id'), $categoryId);

        $data['is_active'] = false;
        $response = $this->assertUpdate($data + ['categories_id' => [$categoryId]], $data + ['deleted_at' => null]);
        $this->assertResource($response, new GenreResource(Genre::find($response->json('data.id'))));
        $this->assertHasCategory($response->json('data.id'), $categoryId);
    }

    public function testRollbackStore()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn(['name' => 'test_name']);

        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);

        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasError = false;

        try {
            $controller->store($request);
        } catch (TestException $exception) {
            $this->assertCount(1, Genre::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testRollbackUpdate()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('findOrFail')
            ->withAnyArgs()
            ->andReturn($this->genre);

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn(['name' => 'test_name']);

        $controller
            ->shouldReceive('rulesUpdate')
            ->withAnyArgs()
            ->andReturn([]);

        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasError = false;

        try {
            $controller->update($request, 1);
        } catch (TestException $exception) {
            $this->assertCount(1, Genre::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testSyncCategories()
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();

        $sendData = ['name' => 'test_name', 'categories_id' => [$categoriesId[0]]];
        $response = $this->postJson($this->routeStore(), $sendData);
        $this->assertDatabaseHas(
            'category_genre',
            ['category_id' => $categoriesId[0], 'genre_id' => $response->json('data.id')]
        );

        $sendData = ['name' => 'test_name', 'categories_id' => [$categoriesId[1], $categoriesId[2]]];
        $response = $this->putJson(route('genres.update', ['genre' => $response->json('data.id')]), $sendData);
        $this->assertDatabaseMissing(
            'category_genre',
            ['category_id' => $categoriesId[0], 'genre_id' => $response->json('data.id')]
        );
        $this->assertDatabaseHas(
            'category_genre',
            ['category_id' => $categoriesId[1], 'genre_id' => $response->json('data.id')]
        );
        $this->assertDatabaseHas(
            'category_genre',
            ['category_id' => $categoriesId[2], 'genre_id' => $response->json('data.id')]
        );
    }

    public function testDestroy()
    {
        $this->assertDestroy();
    }

    protected function assertHasCategory($genreId, $categoryId)
    {
        $this->assertDatabaseHas('category_genre', ['genre_id' => $genreId, 'category_id' => $categoryId]);
    }

    protected function routeStore(): string
    {
        return route('genres.store');
    }

    protected function routeUpdate(): string
    {
        return route('genres.update', ['genre' => $this->genre->id]);
    }

    protected function routeDestroy(Model $model): string
    {
        return route('genres.destroy', ['genre' => $model->id]);
    }

    protected function model(): string
    {
        return Genre::class;
    }
}
