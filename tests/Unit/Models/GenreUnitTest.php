<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class GenreUnitTest extends TestCase
{
    /**
     * @var Genre
     */
    private $genre;

    protected function setUp(): void
    {
        parent::setUp();

        $this->genre = new Genre();
    }

    public function testIfExtendsModelFromEloquent()
    {
        $this->assertInstanceOf(Model::class, $this->genre);
    }

    public function testIfUseTraits()
    {
        $traits = [SoftDeletes::class, Uuid::class];
        $categoryTraits = array_keys(class_uses(Genre::class));

        $this->assertEquals($traits, $categoryTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'is_active'];

        $this->assertEquals($fillable, $this->genre->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['created_at', 'updated_at', 'deleted_at'];

        foreach ($dates as $date) {
            $this->assertContains($date, $this->genre->getDates());
        }

        $this->assertCount(count($dates), $this->genre->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string', 'is_active' => 'boolean'];

        $this->assertEquals($casts, $this->genre->getCasts());
    }

    public function testIncrementing()
    {
        $this->assertFalse($this->genre->incrementing);
    }
}
