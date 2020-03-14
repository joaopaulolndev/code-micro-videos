<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Genre::class, 1)->create();
        $categories = Genre::all();

        $this->assertCount(1, $categories);

        $categoryKey = array_keys($categories->first()->getAttributes());

        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ],
            $categoryKey
        );
    }

    public function testCreate()
    {
        $genre = Genre::create(['name' => 'test_name']);
        $genre->refresh();

        $this->assertIsString($genre->id);
        $this->assertEquals(36, strlen($genre->id));
        $this->assertEquals('test_name', $genre->name);
        $this->assertNull($genre->description);
        $this->assertTrue($genre->is_active);

        $genre = Genre::create(['name' => 'test_name', 'is_active' => true]);
        $this->assertTrue($genre->is_active);

        $genre = Genre::create(['name' => 'test_name', 'is_active' => false]);
        $this->assertFalse($genre->is_active);
    }

    public function testUpdate()
    {
        /** @var Genre $genre */
        $genre = factory(Genre::class)->create([
            'is_active' => false,
        ]);

        $data = ['name' => 'test_name_updated', 'is_active' => true];
        $genre->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $genre->{$key});
        }
    }

    public function testDelete()
    {
        /** @var Genre $genre */
        $genre = factory(Genre::class)->create();

        $genre->delete();
        $this->assertNull(Genre::find($genre->id));

        $genre->restore();
        $this->assertNotNull(Genre::find($genre->id));

        $genre->forceDelete();
        $this->assertNull(Genre::find($genre->id));
    }
}
