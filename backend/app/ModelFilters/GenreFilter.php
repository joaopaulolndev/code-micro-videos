<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%{$search}%");
    }

    public function isActive($isActive)
    {
        $this->where('is_active', '=', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
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
