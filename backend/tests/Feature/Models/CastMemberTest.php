<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();

        $this->assertCount(1, $castMembers);

        $castMemberKey = array_keys($castMembers->first()->getAttributes());

        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'type',
                'created_at',
                'updated_at',
                'deleted_at',
            ],
            $castMemberKey
        );
    }

    public function testCreate()
    {
        $types = [CastMember::TYPE_DIRECTOR, CastMember::TYPE_ACTOR];

        foreach ($types as $type) {
            $castMember = CastMember::create(['name' => 'test_name', 'type' => $type]);
            $castMember->refresh();

            $this->assertTrue(Uuid::isValid($castMember->id));
            $this->assertEquals('test_name', $castMember->name);
            $this->assertEquals($type, $castMember->type);
        }
    }

    public function testUpdate()
    {
        /** @var CastMember $castMember */
        $castMember = factory(CastMember::class)->create([
            'name' => 'test_name',
            'type' => CastMember::TYPE_ACTOR,
        ]);

        $data = [
            'name' => 'test_name_updated',
            'type' => CastMember::TYPE_DIRECTOR,
        ];

        $castMember->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $castMember->{$key});
        }
    }

    public function testDelete()
    {
        /** @var CastMember $castMember */
        $castMember = factory(CastMember::class)->create();

        $castMember->delete();
        $this->assertNull(CastMember::find($castMember->id));

        $castMember->restore();
        $this->assertNotNull(CastMember::find($castMember->id));

        $castMember->forceDelete();
        $this->assertNull(CastMember::find($castMember->id));
    }
}
