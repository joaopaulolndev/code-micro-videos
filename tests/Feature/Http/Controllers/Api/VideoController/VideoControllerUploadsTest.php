<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Video;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Tests\Feature\Traits\TestUploads;
use Tests\Feature\Traits\TestValidations;

class VideoControllerUploadsTest extends BaseVideoControllerTestCase
{
    use TestValidations, TestUploads;

    public function testInvalidationThumbFileField()
    {
        $this->assertInvalidationFile('thumb_file', 'jpg', Video::THUMB_FILE_MAX_SIZE, 'image');
    }

    public function testInvalidationBannerFileField()
    {
        $this->assertInvalidationFile('banner_file', 'jpg', Video::BANNER_FILE_MAX_SIZE, 'image');
    }

    public function testInvalidationTrailerFileField()
    {
        $this->assertInvalidationFile(
            'trailer_file', 'mp4', Video::TRAILER_FILE_MAX_SIZE, 'mimetypes', ['values' => 'video/mp4']
        );
    }

    public function testInvalidationVideoFileField()
    {
        $this->assertInvalidationFile(
            'video_file', 'mp4', Video::VIDEO_FILE_MAX_SIZE, 'mimetypes', ['values' => 'video/mp4']
        );
    }

    public function testStoreWithFiles()
    {
        \Storage::fake();

        $files = $this->getFiles();

        $response = $this->postJson($this->routeStore(), $this->sendData + $files);

        $response->assertStatus(201);
        $this->assertFilesOnPersist($response, $files);
        $this->assertIfFilesUrlExists(Video::find($response->json('data.id')), $response);
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();

        $files = $this->getFiles();

        $response = $this->putJson($this->routeUpdate(), $this->sendData + $files);

        $response->assertStatus(200);
        $this->assertFilesOnPersist($response, $files);
        $this->assertIfFilesUrlExists(Video::find($response->json('data.id')), $response);

        $newFiles = [
            'thumb_file' => UploadedFile::fake()->image('thumb_file.jpg'),
            'video_file' => UploadedFile::fake()->image('video_file.mp4'),
        ];

        $response = $this->putJson($this->routeUpdate(), $this->sendData + $newFiles);

        $response->assertStatus(200);
        $this->assertFilesOnPersist($response, Arr::except($files, ['thumb_file', 'video_file']) + $newFiles);
        $this->assertIfFilesUrlExists(Video::find($response->json('data.id')), $response);

        $videoId = $response->json('data.id');
        $video = Video::find($videoId);

        \Storage::assertMissing($video->relativeFilePath($files['thumb_file']->hashName()));
        \Storage::assertMissing($video->relativeFilePath($files['video_file']->hashName()));
    }

    protected function assertFilesOnPersist(TestResponse $response, array $files)
    {
        $videoId = $response->json('data.id');
        $video = Video::find($videoId);

        $this->assertFilesExistsInStorage($video, $files);
    }

    protected function getFiles()
    {
        return [
            'thumb_file' => UploadedFile::fake()->image('thumb_file.jpg'),
            'banner_file' => UploadedFile::fake()->create('banner_file.jpg'),
            'trailer_file' => UploadedFile::fake()->image('trailer_file.mp4'),
            'video_file' => UploadedFile::fake()->create('video_file.mp4'),
        ];
    }

    protected function routeStore(): string
    {
        return route('videos.store');
    }

    protected function routeUpdate(): string
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model(): string
    {
        return Video::class;
    }
}
