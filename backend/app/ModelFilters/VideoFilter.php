<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class VideoFilter extends DefaultModelFilter
{
    protected $sortable = ['title', 'opened', 'created_at'];

    public function search($search)
    {
        $this->where('title', 'LIKE', "%{$search}%");
    }

    public function opened($opened)
    {
        $this->where('opened', '=', filter_var($opened, FILTER_VALIDATE_BOOLEAN));
    }

    public function genres($genres)
    {
        $idsOrNames = explode(',', $genres);

        $this->whereHas('genres', function (Builder $query) use ($idsOrNames) {
            $query
                ->whereIn('id', $idsOrNames)
                ->orWhereIn('name', $idsOrNames);
        });
    }

    public function categories($categories)
    {
        $idsOrNames = explode(',', $categories);

        $this->whereHas('categories', function (Builder $query) use ($idsOrNames) {
            $query
                ->whereIn('id', $idsOrNames)
                ->orWhereIn('name', $idsOrNames);
        });
    }
}
