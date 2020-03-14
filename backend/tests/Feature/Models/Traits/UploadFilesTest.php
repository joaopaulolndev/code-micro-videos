<?php

namespace Tests\Feature\Models\Traits;

use Tests\Feature\Stubs\Models\Traits\UploadFilesStub;
use Tests\TestCase;

class UploadFilesTest extends TestCase
{
    /**
     * @var UploadFilesStub
     */
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();

        UploadFilesStub::dropTable();
        UploadFilesStub::createTable();

        $this->obj = new UploadFilesStub();
    }

    public function testMakeOldFieldsOnSaving()
    {
        // not exist
        $this->obj->fill([
            'name' => 'test',
            'file1' => 'test1.mp4',
            'file2' => 'test2.mp4',
        ]);

        $this->obj->save();

        $this->assertCount(0, $this->obj->oldFiles);

        $this->obj->update([
            'name' => 'test_name',
            'file2' => 'test3.mp4',
        ]);

        $this->assertEqualsCanonicalizing(['test2.mp4'], $this->obj->oldFiles);
    }

    public function testMakeOldFilesNullOnSaving()
    {
        $this->obj->fill([
            'name' => 'test',
        ]);

        $this->obj->save();

        $this->obj->update([
            'name' => 'test_name',
            'file2' => 'test3.mp4',
        ]);

        $this->assertEqualsCanonicalizing([], $this->obj->oldFiles);
    }
}
