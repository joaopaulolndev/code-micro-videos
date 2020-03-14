<?php

namespace Tests\Feature\Stubs\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResourceStub extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
