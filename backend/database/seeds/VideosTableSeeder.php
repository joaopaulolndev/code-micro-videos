<?php

use Illuminate\Database\Seeder;

class VideosTableSeeder extends Seeder
{
    /**
     * @var \Illuminate\Database\Eloquent\Collection
     */
    private $allGenres;

    /**
     * @var \Illuminate\Database\Eloquent\Collection
     */
    private $allCastMembers;

    /**
     * @var array
     */
    private $relations = [
        'genres_id' => [],
        'categories_id' => [],
        'cast_members_id' => [],
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir, true);

        $self = $this;
        $this->allGenres = \App\Models\Genre::all();
        $this->allCastMembers = \App\Models\CastMember::all();

        \Illuminate\Database\Eloquent\Model::reguard(); // mass assignment

        factory(\App\Models\Video::class, 10)
            ->make()
            ->each(function (\App\Models\Video $video) use ($self) {
                $self->fetchRelations();

                \App\Models\Video::create(
                    array_merge(
                        $video->toArray(),
                        [
                            'thumb_file' => $self->getImageFile(),
                            'banner_file' => $self->getImageFile(),
                            'trailer_file' => $self->getVideoFile(),
                            'video_file' => $self->getVideoFile(),
                        ],
                        $this->relations
                    ));
            });

        \Illuminate\Database\Eloquent\Model::unguard();
    }

    public function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $categoriesId = [];

        foreach ($subGenres as $genre) {
            array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
        }

        $categoriesId = array_unique($categoriesId);
        $genresId = $subGenres->pluck('id')->toArray();
        $this->relations['categories_id'] = $categoriesId;
        $this->relations['genres_id'] = $genresId;
        $this->relations['cast_members_id'] = $this->allCastMembers->random(3)->pluck('id')->toArray();
    }

    public function getImageFile()
    {
        return new \Illuminate\Http\UploadedFile(storage_path('/faker/thumbs/thumb.jpg'), 'thumb.jpg');
    }

    public function getVideoFile()
    {
        return new \Illuminate\Http\UploadedFile(storage_path('/faker/videos/video.mp4'), 'video.mp4');
    }
}
