<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\ValidationException;
use Tests\Feature\Stubs\Controllers\CategoryControllerStub;
use Tests\Feature\Stubs\Models\CategoryStub;
use Tests\TestCase;

class BasicCrudControllerTest extends TestCase
{
    /**
     * @var CategoryControllerStub
     */
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();

        CategoryStub::dropTable();
        CategoryStub::createTable();

        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();

        parent::tearDown();
    }

    public function testIndex()
    {
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $category->refresh();

        /** @var JsonResource $resource */
        $resource = $this->controller->index();
        $serialized = $resource->response()->getData(true);

        $this->assertEquals([$category->toArray()], $serialized['data']);
        $this->assertArrayHasKey('meta', $serialized);
        $this->assertArrayHasKey('links', $serialized);
    }

    public function testInvalidationDataInStore()
    {
        $this->expectException(ValidationException::class);

        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => '']);

        $this->controller->store($request);
    }

    public function testStore()
    {
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test_name', 'description' => 'test_description']);

        /** @var JsonResource $resource */
        $resource = $this->controller->store($request);
        $serialized = $resource->response()->getData(true);

        $this->assertEquals(CategoryStub::first()->toArray(), $serialized['data']);
    }

    public function testIfFindOrFailFetchModel()
    {
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller, [$category->id]);

        $this->assertInstanceOf(CategoryStub::class, $result);
    }

    public function testIfFindOrFailThrowExceptionWhenIdInvalid()
    {
        $this->expectException(ModelNotFoundException::class);

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $reflectionMethod->invokeArgs($this->controller, [0]);
    }

    public function testShow()
    {
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $category->refresh();

        /** @var JsonResource $resource */
        $resource = $this->controller->show($category->id);
        $serialized = $resource->response()->getData(true);

        $this->assertEquals($category->toArray(), $serialized['data']);
    }

    public function testInvalidationDataInUpdate()
    {
        $this->expectException(ValidationException::class);

        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => '']);

        $this->controller->update($request, 0);
    }

    public function testUpdate()
    {
        /** @var CategoryStub $category */
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);

        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test_name_updated', 'description' => null, 'is_active' => false]);

        /** @var JsonResource $resource */
        $resource = $this->controller->update($request, $category->id);
        $serialized = $resource->response()->getData(true);

        $category->refresh();

        $this->assertEquals($category->toArray(), $serialized['data']);
    }

    public function testDestroy()
    {
        $category1 = CategoryStub::create(['name' => 'test_name_1', 'description' => 'test_description_1']);
        $category2 = CategoryStub::create(['name' => 'test_name_2', 'description' => 'test_description_2']);
        $category3 = CategoryStub::create(['name' => 'test_name_3', 'description' => 'test_description_3']);

        $this->assertCount(3, CategoryStub::all());

        $response = $this->controller->destroy($category2->id);
        $this->createTestResponse($response)->assertStatus(204);

        $this->assertCount(2, CategoryStub::all());
        $this->assertNull(CategoryStub::find($category2->id));
        $this->assertDatabaseHas($category1->getTable(), $category1->toArray());
        $this->assertDatabaseHas($category3->getTable(), $category3->toArray());
        $this->assertDatabaseMissing($category2->getTable(), $category2->toArray());
    }
}
