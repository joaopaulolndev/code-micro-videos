<?php

namespace App\Models;

use App\ModelFilters\VideoFilter;
use App\Models\Traits\UploadFiles;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes, Uuid, UploadFiles, Filterable;

    const RATING_LIST = ['L', '10', '12', '14', '16', '18'];

    const THUMB_FILE_MAX_SIZE = 1024 * 5; // 5MB
    const BANNER_FILE_MAX_SIZE = 1024 * 10; // 10MB
    const TRAILER_FILE_MAX_SIZE = 1024 * 1024 * 1; // 1GB
    const VIDEO_FILE_MAX_SIZE = 1024 * 1024 * 50; // 50GB

    public $incrementing = false;

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
        'thumb_file',
        'banner_file',
        'trailer_file',
        'video_file',
    ];

    protected $dates = ['deleted_at'];

    protected $casts = [
        'id' => 'string',
        'year_launched' => 'integer',
        'opened' => 'boolean',
        'rating' => 'string',
        'duration' => 'integer',
    ];

    public static $fileFields = ['thumb_file', 'banner_file', 'trailer_file', 'video_file'];

    public static function create(array $attributes = [])
    {
        $files = self::extractFiles($attributes);

        try {
            \DB::beginTransaction();

            $obj = static::query()->create($attributes);
            static::handleRelations($obj, $attributes);

            $obj->uploadFiles($files);

            \DB::commit();
        } catch (\Exception $e) {
            if (isset($obj)) {
                $obj->deleteFiles($files);
            }

            \DB::rollBack();

            throw $e;
        }

        return $obj->refresh();
    }

    public function update(array $attributes = [], array $options = [])
    {
        $files = self::extractFiles($attributes);

        try {
            \DB::beginTransaction();

            $saved = parent::update($attributes, $options);
            static::handleRelations($this, $attributes);

            if ($saved) {
                $this->uploadFiles($files);
            }

            \DB::commit();

            if ($saved && count($files)) {
                $this->deleteOldFiles();
            }
        } catch (\Exception $e) {
            $this->deleteFiles($files);

            \DB::rollBack();

            throw $e;
        }

        return $this->refresh();
    }

    public static function handleRelations(self $video, array $attributes)
    {
        if (isset($attributes['categories_id'])) {
            $video->categories()->sync($attributes['categories_id']);
        }

        if (isset($attributes['genres_id'])) {
            $video->genres()->sync($attributes['genres_id']);
        }

        if (isset($attributes['cast_members_id'])) {
            $video->castMembers()->sync($attributes['cast_members_id']);
        }
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

    public function castMembers()
    {
        return $this->belongsToMany(CastMember::class)->withTrashed();
    }

    public function getThumbFileUrlAttribute()
    {
        return $this->thumb_file ? $this->getFileUrl($this->thumb_file) : null;
    }

    public function getBannerFileUrlAttribute()
    {
        return $this->banner_file ? $this->getFileUrl($this->banner_file) : null;
    }

    public function getTrailerFileUrlAttribute()
    {
        return $this->trailer_file ? $this->getFileUrl($this->trailer_file) : null;
    }

    public function getVideoFileUrlAttribute()
    {
        return $this->video_file ? $this->getFileUrl($this->video_file) : null;
    }

    protected function uploadDir()
    {
        return $this->id;
    }

    public function modelFilter()
    {
        return $this->provideFilter(VideoFilter::class);
    }
}
