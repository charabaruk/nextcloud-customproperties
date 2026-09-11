<?php

namespace OCA\CustomProperties\Listener;

use OCA\CustomProperties\Plugin\CustomPropertiesSabreServerPlugin;
use OCA\CustomProperties\Service\CurrentUserProvider;
use OCA\CustomProperties\Service\PropertyService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\SabrePluginEvent;

class SabreAddPluginListener implements IEventListener
{
    /**
     * @var PropertyService
     */
    private $propertyService;
    /**
     * @var CurrentUserProvider
     */
    private $currentUserProvider;

    /**
     * SabreAddPluginListener constructor.
     *
     * @param PropertyService $propertyService
     * @param CurrentUserProvider $currentUserProvider
     */
    public function __construct(PropertyService $propertyService, CurrentUserProvider $currentUserProvider)
    {
        $this->propertyService = $propertyService;
        $this->currentUserProvider = $currentUserProvider;
    }

    public function handle(Event $event): void
    {
        if ($event instanceof SabrePluginEvent) {
            $server = $event->getServer();
            $server->addPlugin(new CustomPropertiesSabreServerPlugin(
                $this->propertyService,
                $this->currentUserProvider
            ));
        }
    }
}
