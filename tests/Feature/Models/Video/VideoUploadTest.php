<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;
use Tests\Traits\TestProd;

class VideoUploadTest extends BaseVideoTestCase
{
    use TestProd;

    public function testCreateWithFiles()
    {
        \Storage::fake();

        $video = Video::create(
            $this->data + [
                'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                'banner_file' => UploadedFile::fake()->create('banner.jpg'),
                'trailer_file' => UploadedFile::fake()->image('trailer.mp4'),
                'video_file' => UploadedFile::fake()->create('video.mp4'),
            ]
        );

        \Storage::assertExists("{$video->id}/{$video->thumb_file}");
        \Storage::assertExists("{$video->id}/{$video->banner_file}");
        \Storage::assertExists("{$video->id}/{$video->trailer_file}");
        \Storage::assertExists("{$video->id}/{$video->video_file}");
    }

    public function testCreateIfRollbackFiles()
    {
        \Storage::fake();

        \Event::listen(TransactionCommitted::class, function () {
            throw new TestException();
        });

        $hasError = false;

        try {
            Video::create(
                $this->data + [
                    'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                    'banner_file' => UploadedFile::fake()->create('banner.jpg'),
                    'trailer_file' => UploadedFile::fake()->image('trailer.mp4'),
                    'video_file' => UploadedFile::fake()->create('video.mp4'),
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();

        $video = factory(Video::class)->create();
        $thumbFile = UploadedFile::fake()->image('thumb.jpg');
        $bannerFile = UploadedFile::fake()->image('banner.jpg');
        $trailerFile = UploadedFile::fake()->create('trailer.mp4');
        $videoFile = UploadedFile::fake()->create('video.mp4');

        $video->update(
            $this->data + [
                'thumb_file' => $thumbFile,
                'banner_file' => $bannerFile,
                'trailer_file' => $trailerFile,
                'video_file' => $videoFile,
            ]
        );

        \Storage::assertExists("{$video->id}/{$video->thumb_file}");
        \Storage::assertExists("{$video->id}/{$video->banner_file}");
        \Storage::assertExists("{$video->id}/{$video->trailer_file}");
        \Storage::assertExists("{$video->id}/{$video->video_file}");

        $newThumbFile = UploadedFile::fake()->image('thumb.jpg');
        $newVideoFile = UploadedFile::fake()->create('video.mp4');

        $video->update(
            $this->data + [
                'thumb_file' => $newThumbFile,
                'video_file' => $newVideoFile,
            ]
        );

        \Storage::assertExists("{$video->id}/{$bannerFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$trailerFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$newThumbFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$newVideoFile->hashName()}");

        \Storage::assertMissing("{$video->id}/{$thumbFile->hashName()}");
        \Storage::assertMissing("{$video->id}/{$videoFile->hashName()}");
    }

    public function testUpdateIfRollbackFiles()
    {
        \Storage::fake();

        \Event::listen(TransactionCommitted::class, function () {
            throw new TestException();
        });

        $video = factory(Video::class)->create();

        $hasError = false;

        try {
            $video->update(
                $this->data + [
                    'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                    'banner_file' => UploadedFile::fake()->create('banner.jpg'),
                    'trailer_file' => UploadedFile::fake()->image('trailer.mp4'),
                    'video_file' => UploadedFile::fake()->create('video.mp4'),
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testFileUrlsWithLocalDriver()
    {
        $fileFields = [];

        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "{$field}.test";
        }

        $video = factory(Video::class)->create($fileFields);
        $localDriver = config('filesystems.default');
        $baseUrl = config('filesystems.disks.' . $localDriver)['url'];

        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};

            $this->assertEquals("{$baseUrl}/{$video->id}/{$value}", $fileUrl);
        }
    }

    public function testFileUrlsWithGcsDriver()
    {
        $this->skipTestIfNotProd();

        $fileFields = [];

        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "{$field}.test";
        }

        $video = factory(Video::class)->create($fileFields);
        $baseUrl = config('filesystems.disks.gcs.storage_api_uri');
        \Config::set('filesystems.default', 'gcs');

        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};

            $this->assertEquals("{$baseUrl}/{$video->id}/{$value}", $fileUrl);
        }
    }

    public function testFileUrlsIfNullWhenFieldsAreNull()
    {
        $video = factory(Video::class)->create();

        foreach (Video::$fileFields as $field) {
            $fileUrl = $video->{"{$field}_url"};

            $this->assertNull($fileUrl);
        }
    }
}
