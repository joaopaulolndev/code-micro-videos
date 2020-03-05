<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CastMemberUnitTest extends TestCase
{
    /**
     * @var CastMember
     */
    private $castMember;

    protected function setUp(): void
    {
        parent::setUp();

        $this->castMember = new CastMember();
    }

    public function testIfExtendsModelFromEloquent()
    {
        $this->assertInstanceOf(Model::class, $this->castMember);
    }

    public function testIfUseTraits()
    {
        $traits = [SoftDeletes::class, Uuid::class];
        $castMemberTraits = array_keys(class_uses(CastMember::class));

        $this->assertEquals($traits, $castMemberTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'type'];

        $this->assertEquals($fillable, $this->castMember->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['created_at', 'updated_at', 'deleted_at'];

        foreach ($dates as $date) {
            $this->assertContains($date, $this->castMember->getDates());
        }

        $this->assertCount(count($dates), $this->castMember->getDates());
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string'];

        $this->assertEquals($casts, $this->castMember->getCasts());
    }

    public function testIncrementing()
    {
        $this->assertFalse($this->castMember->incrementing);
    }
}
