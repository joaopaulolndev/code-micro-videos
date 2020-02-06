<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations;

    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.show', ['genre' => $genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray());
    }

    public function testInvalidationData()
    {
        // Insert
        $response = $this->json('POST', route('genres.store'), []);
        $this->assertInvalidationRequired($response);

        $response = $this->json('POST', route('genres.store'), [
            'name' => str_repeat('a', 256),
            'is_active' => 'a'
        ]);
        $this->assertInvalidationMax($response);
        $this->assertInvalidationBoolean($response);

        // Update
        $genre = factory(Genre::class)->create();
        $response = $this->json('PUT', route('genres.update', $genre->id), []);
        $this->assertInvalidationRequired($response);

        $response = $this->json('PUT', route('genres.update', $genre->id), [
            'name' => str_repeat('a', 256),
            'is_active' => 'a'
        ]);
        $this->assertInvalidationMax($response);
        $this->assertInvalidationBoolean($response);
    }

    private function assertInvalidationRequired(TestResponse $response)
    {
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonMissingValidationErrors(['is_active'])
            ->assertJsonFragment([
                __('validation.required', ['attribute' => 'name'])
            ]);
    }

    private function assertInvalidationMax(TestResponse $response)
    {
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonFragment([
                __('validation.max.string', ['attribute' => 'name', 'max' => 255])
            ]);
    }

    private function assertInvalidationBoolean(TestResponse $response)
    {
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['is_active'])
            ->assertJsonFragment([
                __('validation.boolean', ['attribute' => 'is active'])
            ]);
    }

    public function testStore()
    {
        $response = $this->json('POST', route('genres.store'), [
            'name' => 'test'
        ]);

        $id = $response->json('id');
        $genre = Genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($genre->toArray());

        $this->assertTrue($response->json('is_active'));

        $response = $this->json('POST', route('genres.store'), [
            'name' => 'test',
            'is_active' => false
        ]);

        $response->assertJsonFragment([
            'is_active' => false
        ]);
    }

    public function testUpdate()
    {
        $genre = factory(Genre::class)->create([
            'is_active' => false
        ]);
        $response = $this->json('PUT', route('genres.update', $genre->id), [
            'name' => 'test',
            'is_active' => true
        ]);

        $id = $response->json('id');
        $genre = Genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray())
            ->assertJsonFragment([
                'is_active' => true
            ]);

        $response = $this->json('PUT', route('genres.update', $genre->id), [
            'name' => 'test',
            'is_active' => true
        ]);
    }

    public function testDelete()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->json('DELETE', route('genres.destroy', $genre->id),[]);

        $response->assertStatus(204);
    }
}
