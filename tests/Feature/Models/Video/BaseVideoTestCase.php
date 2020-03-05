<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoTestCase extends TestCase
{
    use DatabaseMigrations;

    /**
     * @var array
     */
    protected $data = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->data = [
            'title' => 'test_title',
            'description' => 'test_description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
        ];
    }
}
